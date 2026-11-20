"""Download a user-supplied URL without letting it reach private networks (SSRF protection).

Every hop is resolved once, every resolved address must be public (`ipaddress.is_global`),
and the connection goes to that checked address, so a second DNS answer cannot redirect it
(DNS rebinding). HTTPS still verifies the certificate against the original hostname via SNI.
Redirects are followed by hand, up to MAX_REDIRECTS, and each target goes through the same checks.
"""

from __future__ import annotations

import ipaddress
import socket
import time
from urllib.parse import urljoin, urlsplit

import certifi
import urllib3

MAX_REDIRECTS = 3
REDIRECT_STATUSES = {301, 302, 303, 307, 308}


class FetchError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(message)
        self.status, self.message = status, message


def public_address(host: str, port: int) -> str:
    """Resolve host and return an address, refusing if any address is not public."""
    try:
        infos = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    except (socket.gaierror, UnicodeError):
        raise FetchError(400, "Could not fetch the URL.") from None
    addresses = []
    for info in infos:
        address = ipaddress.ip_address(info[4][0].split("%")[0])
        if address.version == 6 and address.ipv4_mapped:
            address = address.ipv4_mapped
        if not address.is_global or address.is_multicast:
            raise FetchError(422, "That URL points to a private or local network address.")
        addresses.append(str(address))
    if not addresses:
        raise FetchError(400, "Could not fetch the URL.")
    return addresses[0]


def open_pinned(url: str, timeout: float) -> urllib3.BaseHTTPResponse:
    """Send one GET to the checked address of url's host, without following redirects."""
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise FetchError(422, "Enter a full http:// or https:// link.")
    try:
        port = parts.port or (443 if parts.scheme == "https" else 80)
    except ValueError:
        raise FetchError(422, "Enter a full http:// or https:// link.") from None
    address = public_address(parts.hostname, port)
    options = {"timeout": urllib3.Timeout(connect=timeout, read=timeout), "retries": False}
    if parts.scheme == "https":
        pool = urllib3.HTTPSConnectionPool(
            address, port, server_hostname=parts.hostname, assert_hostname=parts.hostname,
            cert_reqs="CERT_REQUIRED", ca_certs=certifi.where(), **options,
        )
    else:
        pool = urllib3.HTTPConnectionPool(address, port, **options)
    host = f"[{parts.hostname}]" if ":" in parts.hostname else parts.hostname
    target = (parts.path or "/") + (f"?{parts.query}" if parts.query else "")
    headers = {"Host": host + (f":{parts.port}" if parts.port else ""), "User-Agent": "wasmer-template/1.0"}
    return pool.urlopen("GET", target, headers=headers, redirect=False, preload_content=False)


def fetch(url: str, *, max_bytes: int, timeout: float) -> bytes:
    """Return the body of url, enforcing max_bytes and a total time limit of timeout seconds."""
    deadline = time.monotonic() + timeout
    too_large = FetchError(413, f"The file is larger than {max_bytes // 1024 // 1024} MB.")
    try:
        for _ in range(MAX_REDIRECTS + 1):
            response = open_pinned(url.strip(), timeout)
            location = response.headers.get("location")
            if response.status in REDIRECT_STATUSES and location:
                response.release_conn()
                url = urljoin(url, location)
                continue
            if response.status >= 400:
                raise FetchError(400, "Could not fetch the URL.")
            if response.headers.get("content-type", "").startswith("text/html"):
                raise FetchError(415, "That link opens a web page, not a file. Use a direct link to the file.")
            length = response.headers.get("content-length", "")
            if length.isdigit() and int(length) > max_bytes:
                raise too_large
            body = bytearray()
            for chunk in response.stream(64 * 1024):
                body += chunk
                if len(body) > max_bytes:
                    raise too_large
                if time.monotonic() > deadline:
                    raise urllib3.exceptions.TimeoutError()
            return bytes(body)
        raise FetchError(400, f"The URL redirected more than {MAX_REDIRECTS} times.")
    except urllib3.exceptions.TimeoutError:
        raise FetchError(504, f"The download took longer than {timeout:g} seconds.") from None
    except urllib3.exceptions.HTTPError:
        raise FetchError(400, "Could not fetch the URL.") from None
