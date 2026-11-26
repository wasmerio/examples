// Compress local MP4 and WebM files without replacing originals before validation.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { compressVideoFile } from './compress-video-file.mjs';

const ffmpegPath = createRequire(import.meta.url)('@ffmpeg-installer/ffmpeg').path;
const videosDirectory = path.resolve('public/assets/videos');
const videoExtensions = new Set(['.mp4', '.webm']);

if (!fs.existsSync(videosDirectory)) {
  console.log('compress-videos: no public/assets/videos directory, skipping.');
  process.exit(0);
}

function collectVideos(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...collectVideos(fullPath));
    else if (videoExtensions.has(path.extname(entry.name).toLowerCase())) results.push(fullPath);
  }
  return results;
}

function runFfmpeg(args) {
  try {
    execFileSync(ffmpegPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0 };
  } catch (error) {
    return {
      status: typeof error?.status === 'number' ? error.status : null,
      error,
      stderr: error?.stderr,
    };
  }
}

function probeMedia(input) {
  const stderr = runFfmpeg(['-hide_banner', '-i', input]).stderr?.toString() || '';
  const videoLine = stderr.split('\n').find((line) => line.includes('Video:'));
  const sizeMatch = videoLine?.match(/(\d{2,5})x(\d{2,5})/);
  const durationMatch = stderr.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!durationMatch) throw new Error(`Unable to determine media duration: ${input}`);

  return {
    height: sizeMatch ? Number.parseInt(sizeMatch[2], 10) : null,
    duration: Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]),
  };
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const files = collectVideos(videosDirectory);
console.log(`Found ${files.length} video files.`);
console.log('-'.repeat(70));

let totalBefore = 0;
let totalAfter = 0;
let convertedCount = 0;
let skippedCount = 0;

for (const file of files) {
  const before = fs.statSync(file).size;
  totalBefore += before;

  try {
    const result = compressVideoFile({
      file,
      probe: probeMedia,
      runFfmpeg,
      files: {
        exists: (target) => fs.existsSync(target),
        size: (target) => fs.statSync(target).size,
        rename: (from, to) => fs.renameSync(from, to),
        remove: (target, options) => fs.rmSync(target, options),
      },
    });

    if (result.converted) convertedCount++;
    totalAfter += result.outputBytes;
    const savedPercent = result.sourceBytes > 0
      ? (((result.sourceBytes - result.outputBytes) / result.sourceBytes) * 100).toFixed(1)
      : '0.0';
    console.log(
      `${path.relative(videosDirectory, file)} -> ${path.relative(videosDirectory, result.target)} | ` +
      `${formatMb(result.sourceBytes)} -> ${formatMb(result.outputBytes)} (${savedPercent}%) | ` +
      `crf ${result.crf} | ${(result.elapsedMs / 1000).toFixed(1)}s`,
    );
  } catch (error) {
    skippedCount++;
    console.error(`Failed ${file}: ${error.message}`);
  }
}

console.log('-'.repeat(70));
console.log(`Total before: ${formatMb(totalBefore)}`);
console.log(`Total after:  ${formatMb(totalAfter)}`);
console.log(`WebM conversions: ${convertedCount}, failed files: ${skippedCount}`);
if (skippedCount > 0) process.exitCode = 1;
