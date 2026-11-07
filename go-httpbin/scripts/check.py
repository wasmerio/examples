"""Smoke-test an actual local or deployed go-httpbin server with stdlib only."""

import json
import sys
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, file, code, message, headers, new_url):
        return None


base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:18127"
direct = build_opener(NoRedirect)
following = build_opener()


def request(path, *, data=None, headers=None, follow=False):
    req = Request(base + path, data=data, headers=headers or {})
    try:
        response = (following if follow else direct).open(req, timeout=15)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read(), response.url


status, _, body, _ = request("/")
assert status == 200 and b"HTTP Client Testing Service" in body

status, _, body, _ = request("/get?message=wasmer", headers={"X-Template-Test": "go-httpbin"})
data = json.loads(body)
assert status == 200 and data["args"]["message"] == ["wasmer"]
assert data["headers"]["X-Template-Test"] == ["go-httpbin"]

payload = {"template": "go-httpbin", "ok": True}
status, _, body, _ = request("/anything", data=json.dumps(payload).encode(),
                            headers={"Content-Type": "application/json"})
assert status == 200 and json.loads(body)["json"] == payload

status, _, body, _ = request("/headers", headers={"Authorization": "example-test-only",
                                                 "Cookie": "template-test=public"})
reflected = {key.lower() for key in json.loads(body)["headers"]}
assert status == 200 and not {"authorization", "cookie"} & reflected

status, _, body, url = request("/redirect/2", follow=True)
assert status == 200 and url.endswith("/get")

status, _, body, _ = request("/status/204")
assert status == 204 and body == b""

status, _, _, _ = request("/status/418")
assert status == 418

status, headers, _, _ = request("/redirect-to?url=https%3A%2F%2Fexample.com%2F")
assert status == 302 and headers["Location"] == "https://example.com/"

status, _, _, _ = request("/redirect-to?url=https%3A%2F%2Funtrusted.invalid%2F")
assert status == 403

print("Passed 9 HTTP smoke cases: upstream home, GET/header inspection, JSON POST, "
      "header filtering, relative redirects, 204, 418, allowed and blocked external redirects.")
