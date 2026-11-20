"""Video frame grabber: FastAPI + ffmpeg-python on Wasmer Edge.

Give it a video URL and a time; it downloads the video, reads it with ffprobe and returns the
frame at that time as a JPEG, plus a few evenly spaced thumbnails for the HTML page.

Routes:
    GET /                 HTML page
    GET /process          HTML page with the result (also the no-JavaScript form target)
    GET /api/frame        the frame as image/jpeg
    GET /api/info         duration, size and codec as JSON
    GET /docs             interactive API docs
"""

from __future__ import annotations

import base64
import html
import subprocess
import tempfile
import time as clock
from pathlib import Path
from urllib.parse import urlencode, urlsplit

import ffmpeg
import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles

# Limits. Wasmer Edge instances have about 1 GB of memory and /tmp is not persistent.
MAX_DOWNLOAD_BYTES = 50 * 1024 * 1024  # largest video the app will download
DOWNLOAD_TIMEOUT_SECONDS = 20  # total time allowed for the download
MAX_DURATION_SECONDS = 30 * 60  # longest video accepted
FFMPEG_TIMEOUT_SECONDS = 30  # per ffprobe/ffmpeg run
THUMBNAIL_COUNT = 4
THUMBNAIL_WIDTH = 320
SAMPLE_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

STATIC_DIR = Path(__file__).parent / "static"

app = FastAPI(
    title="Video frame grabber",
    description="Extract a frame from a video URL with ffmpeg, running on Wasmer Edge.",
)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def check_url(url: str) -> str:
    url = url.strip()
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        raise HTTPException(422, "Enter a full http:// or https:// link to a video file.")
    return url


def check_time(value: str | float) -> float:
    try:
        seconds = float(value)
    except (TypeError, ValueError):
        raise HTTPException(422, "Time must be a number of seconds, for example 2.5.") from None
    if not 0 <= seconds <= MAX_DURATION_SECONDS:
        raise HTTPException(422, f"Time must be between 0 and {MAX_DURATION_SECONDS} seconds.")
    return seconds


def download(url: str, destination: Path) -> None:
    """Stream the URL into destination, enforcing the size and time limits."""
    deadline = clock.monotonic() + DOWNLOAD_TIMEOUT_SECONDS
    too_large = HTTPException(413, f"The video is larger than {MAX_DOWNLOAD_BYTES // 1024 // 1024} MB.")
    try:
        with requests.get(url, stream=True, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:
            response.raise_for_status()
            if response.headers.get("content-type", "").startswith("text/html"):
                raise HTTPException(415, "That link opens a web page, not a video file. Use a direct link to the file.")
            if int(response.headers.get("content-length") or 0) > MAX_DOWNLOAD_BYTES:
                raise too_large
            received = 0
            with destination.open("wb") as file:
                for chunk in response.iter_content(chunk_size=64 * 1024):
                    received += len(chunk)
                    if received > MAX_DOWNLOAD_BYTES:
                        raise too_large
                    if clock.monotonic() > deadline:
                        raise requests.Timeout()
                    file.write(chunk)
    except requests.Timeout:
        raise HTTPException(504, f"The download took longer than {DOWNLOAD_TIMEOUT_SECONDS} seconds.") from None
    except requests.HTTPError as error:
        raise HTTPException(400, f"The URL answered with HTTP {error.response.status_code}.") from None
    except requests.RequestException:
        raise HTTPException(400, "Could not download the video. Check that the URL is public.") from None


def probe(path: Path) -> dict:
    """Return duration, size and codec of the first video stream."""
    try:
        info = ffmpeg.probe(str(path), timeout=FFMPEG_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        raise HTTPException(504, f"ffprobe took longer than {FFMPEG_TIMEOUT_SECONDS} seconds.") from None
    except ffmpeg.Error:
        raise HTTPException(415, "ffmpeg could not read that file as a video.") from None
    stream = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), None)
    duration = float(info.get("format", {}).get("duration") or 0)
    if stream is None or duration <= 0:
        raise HTTPException(415, "That file has no video track ffmpeg can read.")
    if duration > MAX_DURATION_SECONDS:
        raise HTTPException(413, f"The video is longer than {MAX_DURATION_SECONDS // 60} minutes.")
    return {
        "duration_seconds": round(duration, 3),
        "width": stream.get("width"),
        "height": stream.get("height"),
        "codec": stream.get("codec_name"),
        "size_bytes": path.stat().st_size,
    }


def grab(path: Path, seconds: float, width: int | None = None) -> bytes:
    """Return the frame at `seconds` as JPEG bytes, optionally scaled to `width`."""
    stream = ffmpeg.input(str(path), ss=seconds)
    if width:
        stream = stream.filter("scale", width, -2)
    # ffmpeg-python builds the command; subprocess.run adds the time limit that .run() lacks.
    command = stream.output("pipe:", vframes=1, format="image2", vcodec="mjpeg").compile()
    try:
        result = subprocess.run(command, capture_output=True, timeout=FFMPEG_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        raise HTTPException(504, f"ffmpeg took longer than {FFMPEG_TIMEOUT_SECONDS} seconds.") from None
    if result.returncode or not result.stdout:
        raise HTTPException(422, f"ffmpeg could not extract a frame at {seconds:g} s.")
    return result.stdout


def extract(url: str, time: str | float, thumbnails: bool = False) -> dict:
    url, seconds = check_url(url), check_time(time)
    with tempfile.TemporaryDirectory() as folder:
        video = Path(folder) / "video"
        download(url, video)
        info = probe(video)
        if seconds >= info["duration_seconds"]:
            raise HTTPException(422, f"The video is {info['duration_seconds']:g} s long. Pick a time below that.")
        result = {**info, "time": seconds, "frame": grab(video, seconds)}
        if thumbnails:
            step = info["duration_seconds"] / THUMBNAIL_COUNT
            times = [round(step * i, 1) for i in range(THUMBNAIL_COUNT)]
            result["thumbnails"] = [(t, grab(video, t, THUMBNAIL_WIDTH)) for t in times]
    return result


@app.get("/api/frame", response_class=Response, responses={200: {"content": {"image/jpeg": {}}}})
def api_frame(
    url: str = Query(..., description="Direct http(s) link to a video file"),
    time: float = Query(1, ge=0, description="Time of the frame in seconds"),
    download: bool = Query(False, description="Send as an attachment"),
) -> Response:
    """Return the frame at `time` seconds as a JPEG."""
    result = extract(url, time)
    headers = {"Content-Disposition": f'attachment; filename="frame-{time:g}s.jpg"'} if download else {}
    return Response(result["frame"], media_type="image/jpeg", headers=headers)


@app.get("/api/info")
def api_info(url: str = Query(..., description="Direct http(s) link to a video file")) -> dict:
    """Return the duration, size and codec of the video."""
    with tempfile.TemporaryDirectory() as folder:
        video = Path(folder) / "video"
        download(check_url(url), video)
        return probe(video)


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    return page(SAMPLE_VIDEO_URL, "1")


@app.get("/process", response_class=HTMLResponse)
def process(url: str = "", time: str = "1") -> HTMLResponse:
    """HTML result page. Kept from the original example; the form submits here."""
    try:
        return HTMLResponse(page(url, time, extract(url, time, thumbnails=True)))
    except HTTPException as error:
        return HTMLResponse(page(url, time, error=error.detail), status_code=error.status_code)


def data_uri(jpeg: bytes) -> str:
    return "data:image/jpeg;base64," + base64.b64encode(jpeg).decode("ascii")


def page(url: str, time: str, result: dict | None = None, error: str = "") -> str:
    e = html.escape
    output = f'<wasmer-notice variant="error">{e(error)}</wasmer-notice>' if error else ""
    if result:

        def query(**params) -> str:
            return e(urlencode({"url": url, **params}))

        thumbs = "".join(
            f'<a href="/process?{query(time=t)}"><img src="{data_uri(jpeg)}" alt="Frame at {t:g} s"><span>{t:g} s</span></a>'
            for t, jpeg in result["thumbnails"]
        )
        output = f"""<figure><img src="{data_uri(result['frame'])}" alt="Frame at {result['time']:g} s">
<figcaption>Frame at {result['time']:g} s · {result['width']}×{result['height']} {e(result['codec'] or '')} ·
video is {result['duration_seconds']:g} s long</figcaption></figure>
<wasmer-stack><wasmer-action href="/api/frame?{query(time=result['time'], download='true')}">Download JPEG</wasmer-action>
<wasmer-action variant="outline" href="/api/info?{query()}">Video info (JSON)</wasmer-action></wasmer-stack>
<wasmer-text>Jump to another point in the video:</wasmer-text><nav class="thumbs" aria-label="Thumbnails">{thumbs}</nav>"""
    limits = f"Videos up to {MAX_DOWNLOAD_BYTES // 1024 // 1024} MB and {MAX_DURATION_SECONDS // 60} minutes."
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Video frame grabber · FFmpeg on Wasmer Edge</title><script type="module" src="/static/wasmer-starter-ui.js"></script>
<style>body{{margin:0}}form{{display:grid;gap:16px}}figure{{margin:0;display:grid;gap:8px}}
img{{display:block;max-width:100%;height:auto;border-radius:6px;background:#0f0518}}
figcaption{{font-size:14px;color:rgba(15,5,24,.5)}}
.thumbs{{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}}@media(min-width:600px){{.thumbs{{grid-template-columns:repeat(4,1fr)}}}}
.thumbs a{{display:grid;gap:4px;color:inherit;font-size:14px;text-decoration:none;border-radius:6px}}
.thumbs a:hover span{{text-decoration:underline}}.thumbs a:focus-visible{{outline:2px solid #0a0a0a;outline-offset:2px}}</style></head>
<body><wasmer-starter><wasmer-card>
<wasmer-stack slot="header" vertical><wasmer-badge>FastAPI + FFmpeg</wasmer-badge><wasmer-title>Video frame grabber</wasmer-title></wasmer-stack>
<wasmer-text>Paste a direct link to a video file and pick a time. ffmpeg runs inside this app on Wasmer Edge and returns that frame as a JPEG.</wasmer-text>
<form action="/process" method="get">
<wasmer-input name="url" type="url" label="Video URL" placeholder="https://example.com/video.mp4" value="{e(url)}" required></wasmer-input>
<wasmer-input name="time" label="Time in seconds" placeholder="2.5" value="{e(time)}" maxlength="10" required></wasmer-input>
<wasmer-stack><wasmer-action type="submit" id="submit">Grab frame</wasmer-action></wasmer-stack>
</form>
{output}
<wasmer-stack slot="footer"><wasmer-action variant="outline" href="/docs">API docs</wasmer-action><wasmer-text>{limits}</wasmer-text></wasmer-stack>
</wasmer-card></wasmer-starter>
<script type="module">
const submit = document.querySelector("#submit");
document.querySelector("form").addEventListener("submit", () => {{ submit.loading = true; }});
addEventListener("pageshow", () => {{ submit.loading = false; }});
</script></body></html>"""
