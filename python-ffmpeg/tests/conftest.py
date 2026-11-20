"""Fake network for tests: public DNS answers and queued HTTP responses, no real sockets."""

import ipaddress
import socket
from io import BytesIO

import pytest
import urllib3

PUBLIC_IP = "93.184.215.14"


class FakeNetwork:
    def __init__(self, monkeypatch):
        self.responses, self.requests = [], []
        monkeypatch.setattr(socket, "getaddrinfo", self.getaddrinfo)
        monkeypatch.setattr(urllib3.HTTPConnectionPool, "urlopen", lambda pool, *a, **k: self.urlopen(pool, *a, **k))

    def serve(self, body=b"", status=200, content_type="application/octet-stream", headers=None):
        """Queue the response to the next request."""
        headers = {"content-type": content_type, "content-length": str(len(body)), **(headers or {})}
        self.responses.append(urllib3.HTTPResponse(BytesIO(body), headers, status, preload_content=False))

    @staticmethod
    def getaddrinfo(host, port, *args, **kwargs):
        try:
            address = str(ipaddress.ip_address(host))  # literal IPs resolve to themselves
        except ValueError:
            address = PUBLIC_IP
        family = socket.AF_INET6 if ":" in address else socket.AF_INET
        return [(family, socket.SOCK_STREAM, 6, "", (address, port))]

    def urlopen(self, pool, method, url, headers=None, **kwargs):
        self.requests.append({"ip": pool.host, "path": url, "host": headers["Host"]})
        if not self.responses:
            raise AssertionError("unexpected request")
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return response


@pytest.fixture
def network(monkeypatch):
    return FakeNetwork(monkeypatch)
