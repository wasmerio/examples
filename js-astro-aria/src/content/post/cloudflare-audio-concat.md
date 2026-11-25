---
layout: ../../layouts/post.astro
title: Concatenating Audio Files in Cloudflare Workers
description: Stitching multiple audio tracks together in Cloudflare Workers by leveraging Browser Rendering and WASM-based FFmpeg.
dateFormatted: April 19, 2025
---

I recently switched the [Hacker News Podcast](https://hacker-news.agi.li/) to a two-speaker format. Because TTS models don't handle multi-speaker dialogues well in a single pass, I needed a way to stitch individual speaker tracks together.

The project runs on the Cloudflare Workers runtime (inside Cloudflare Workflows), which lacks native Node.js APIs and cannot run native C++ binaries. Cloudflare Containers wasn't generally available yet, so Browser Rendering was the only viable escape hatch.

Audio concatenation is usually an FFmpeg job, and fortunately FFmpeg can run in the browser via WebAssembly. The overall approach:

1. Launch a headless browser instance using a Worker binding (Cloudflare Browser Rendering).
2. Navigate to an internal page that runs WASM FFmpeg to merge the tracks and returns an audio Blob.
3. Send the Blob back to the Worker and store the final output in R2.

The code is pretty straightforward, though debugging remote headless browsers was a bit of a headache.

Here is the implementation:

### Browser-Side Audio Merging

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Audio</title>
  </head>
  <body>
    <script>
      const concatAudioFilesOnBrowser = async (audioFiles) => {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js'
        document.head.appendChild(script)
        await new Promise((resolve) => (script.onload = resolve))

        const { createFFmpeg, fetchFile } = FFmpeg
        const ffmpeg = createFFmpeg({ log: true })

        await ffmpeg.load()

        // Download and write each file to FFmpeg's virtual file system
        for (const [index, audioFile] of audioFiles.entries()) {
          const audioData = await fetchFile(audioFile)
          ffmpeg.FS('writeFile', `input${index}.mp3`, audioData)
        }

        // Create a file list for ffmpeg concat
        const fileList = audioFiles.map((_, i) => `file 'input${i}.mp3'`).join('\n')
        ffmpeg.FS('writeFile', 'filelist.txt', fileList)

        // Execute FFmpeg command to concatenate files
        await ffmpeg.run(
          '-f',
          'concat',
          '-safe',
          '0',
          '-i',
          'filelist.txt',
          '-c:a',
          'libmp3lame',
          '-q:a',
          '5',
          'output.mp3',
        )

        // Read the output file
        const data = ffmpeg.FS('readFile', 'output.mp3')

        // Create a downloadable link
        const blob = new Blob([data.buffer], { type: 'audio/mp3' })

        // Clean up
        audioFiles.forEach((_, i) => {
          ffmpeg.FS('unlink', `input${i}.mp3`)
        })
        ffmpeg.FS('unlink', 'filelist.txt')
        ffmpeg.FS('unlink', 'output.mp3')

        return blob
      }
    </script>
  </body>
</html>
```

### Worker Invocation

```ts
export async function concatAudioFiles(audioFiles: string[], BROWSER: Fetcher, { workerUrl }: { workerUrl: string }) {
  const browser = await puppeteer.launch(BROWSER)
  const page = await browser.newPage()
  await page.goto(`${workerUrl}/audio`)

  console.info('start concat audio files', audioFiles)
  const fileUrl = await page.evaluate(async (audioFiles) => {
    // JS runs here in the browser.
    // @ts-expect-error Objects in the browser
    const blob = await concatAudioFilesOnBrowser(audioFiles)

    const result = new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return await result
  }, audioFiles) as string

  console.info('concat audio files result', fileUrl.substring(0, 100))

  await browser.close()

  const response = await fetch(fileUrl)
  return await response.blob()
}

const audio = await concatAudioFiles(audioFiles, env.BROWSER, { workerUrl: env.HACKER_NEWS_WORKER_URL })
return new Response(audio)
```

Cursor wrote most of the glue code above. You can see the full working pipeline in the [Hacker News repo](https://github.com/miantiao-me/hacker-news/tree/main/worker).
