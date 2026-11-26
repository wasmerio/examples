import path from 'node:path';
import { assertDurationPreserved, assertFfmpegSucceeded, replaceWithRollback, validateMediaOutput } from './video-safety.mjs';

export function compressVideoFile({ file, probe, runFfmpeg, files, now = Date.now }) {
  const extension = path.extname(file).toLowerCase();
  if (!['.mp4', '.webm'].includes(extension)) throw new Error(`Unsupported video format: ${extension}`);

  const isWebm = extension === '.webm';
  const target = isWebm ? file.replace(/\.webm$/i, '.mp4') : file;
  if (isWebm && files.exists(target)) throw new Error(`Refusing to overwrite existing MP4 target: ${target}`);

  const temporary = `${target}.tmp.mp4`;
  if (files.exists(temporary)) throw new Error(`Refusing to overwrite existing temporary output: ${temporary}`);

  const sourceBytes = files.size(file);
  let completed = false;

  try {
    const sourceMetadata = probe(file);
    const crf = sourceMetadata.height !== null && sourceMetadata.height <= 1280 ? '26' : '28';
    const args = [
      '-y', '-i', file,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', crf,
      '-vf', "scale='min(1920,iw)':-2",
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      temporary,
    ];

    const start = now();
    assertFfmpegSucceeded(runFfmpeg(args), `Compressing ${file}`);
    const elapsedMs = now() - start;

    validateMediaOutput(temporary, files.size, (output) =>
      runFfmpeg(['-v', 'error', '-xerror', '-i', output, '-f', 'null', '-']),
    );
    assertDurationPreserved(sourceMetadata.duration, probe(temporary).duration);

    replaceWithRollback(temporary, target, files);
    if (isWebm) files.remove(file);

    const outputBytes = files.size(target);
    completed = true;
    return { target, sourceBytes, outputBytes, crf, elapsedMs, converted: isWebm };
  } finally {
    if (!completed && files.exists(temporary)) files.remove(temporary);
  }
}
