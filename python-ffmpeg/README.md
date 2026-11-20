# Video frame grabber (FastAPI + FFmpeg) on Wasmer

Paste a link to a video file, pick a time, and get that frame back as a JPEG. The page also shows four evenly spaced thumbnails, so you can jump through the video. Everything runs in one FastAPI app with [ffmpeg-python](https://github.com/kkroening/ffmpeg-python); ffmpeg itself runs inside the app on Wasmer Edge.

## Demo

<https://ffmpeg-frame-grabber-template.wasmer.app/>

The form starts with a short CC0 clip from MDN, so **Grab frame** works straight away.

## How it works

Everything is in `main.py`:

1. **Download.** `fetch.py` downloads the URL into a temporary directory (see below). Web pages (`text/html`), files over the size limit and slow downloads are rejected with a clear message.
2. **Probe.** `ffmpeg.probe()` (ffprobe) reads the duration, size and codec. Files without a video track, and videos over the length limit, are rejected.
3. **Extract.** `ffmpeg.input(path, ss=time).output("pipe:", vframes=1, format="image2", vcodec="mjpeg")` seeks to the time and writes one JPEG to stdout. ffmpeg-python builds the command and `subprocess.run` runs it with a timeout. Thumbnails use the same call with a `scale` filter.
4. **Respond.** The HTML page embeds the frames; the API returns the JPEG or JSON. The temporary directory is removed after each request.

`fetch.py` downloads URLs safely. It resolves the host, refuses any address that isn't public (private, loopback, link-local such as `169.254.169.254`, multicast, reserved, and their IPv6 forms), connects to the address it checked so DNS rebinding can't switch it, and follows at most 3 redirects, checking each one the same way. HTTPS certificates are still verified against the original hostname. Upstream errors are reported as "Could not fetch the URL." without details.

The limits are one block of constants at the top of `main.py`:

| Constant | Default |
| --- | --- |
| `MAX_DOWNLOAD_BYTES` | 50 MB |
| `DOWNLOAD_TIMEOUT_SECONDS` | 20 s |
| `MAX_DURATION_SECONDS` | 30 minutes |
| `FFMPEG_TIMEOUT_SECONDS` | 30 s per ffmpeg/ffprobe run |
| `THUMBNAIL_COUNT`, `THUMBNAIL_WIDTH` | 4, 320 px |

Errors come back as JSON `{"detail": "..."}` from the API, or as a message on the page: 422 for invalid input, a private address or a time past the end, 400 when the URL can't be downloaded, 413 when the video is too large or too long, 415 when the file isn't a readable video, and 504 on timeouts.

The page uses the shared Wasmer starter components in `static/wasmer-starter-ui.js`, generated from `_shared/starter-ui/` at the repository root.

### API

| Route | Returns |
| --- | --- |
| `GET /api/frame?url=…&time=2` | The frame as `image/jpeg`. Add `download=true` to get it as an attachment. |
| `GET /api/info?url=…` | `{"duration_seconds", "width", "height", "codec", "size_bytes"}` |
| `GET /process?url=…&time=2` | The HTML page with the result. This is the original route of this example. |
| `GET /docs` | Interactive API docs |

```bash
curl -o frame.jpg "https://ffmpeg-frame-grabber-template.wasmer.app/api/frame?url=https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4&time=2"
```

The app downloads any public URL it's given. If you deploy it for others, keep the limits low or put it behind authentication.

## Running locally

Use Python 3.13 and install the ffmpeg command-line tools (`brew install ffmpeg` or `apt install ffmpeg`):

```bash
cd python-ffmpeg
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn main:app --reload
```

Open <http://localhost:8000/>. Run the tests with `.venv/bin/python -m pytest`. They generate a short test video with ffmpeg and replace the download with a fake response, so they don't use the network. `tests/conftest.py` fakes DNS and HTTP, which also covers private addresses and redirects.

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-ffmpeg`, or upload this directory.
2. Wasmer detects FastAPI and runs `uvicorn main:app`. It sees `ffmpeg-python` in `requirements.txt` and adds the `ffmpeg` package (with `ffprobe`) to the app, so nothing else needs configuring.
3. Deploy and open the app URL.

With the CLI, from this directory:

```bash
wasmer deploy
```

No database, secrets or volumes are needed.
