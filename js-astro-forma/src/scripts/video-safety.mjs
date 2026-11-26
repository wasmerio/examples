/** @typedef {{ status: number | null, error?: Error, stderr?: Buffer | string }} FfmpegResult */

/** @param {FfmpegResult} result @param {string} operation */
export function assertFfmpegSucceeded(result, operation) {
  if (!result.error && result.status === 0) return;

  const details = result.stderr?.toString().trim();
  throw new Error(`${operation} failed${details ? `: ${details}` : ''}`, {
    cause: result.error,
  });
}

/** @param {string} outputPath @param {(path: string) => number} getSize @param {(path: string) => FfmpegResult} decode */
export function validateMediaOutput(outputPath, getSize, decode) {
  if (getSize(outputPath) <= 0) {
    throw new Error(`FFmpeg produced an empty output: ${outputPath}`);
  }

  assertFfmpegSucceeded(decode(outputPath), `Validating ${outputPath}`);
}

/** @param {number} sourceDuration @param {number} outputDuration */
export function assertDurationPreserved(sourceDuration, outputDuration) {
  if (!Number.isFinite(sourceDuration) || !Number.isFinite(outputDuration) || sourceDuration <= 0) {
    throw new Error('Unable to verify compressed media duration');
  }

  const tolerance = Math.max(0.5, sourceDuration * 0.01);
  if (outputDuration < sourceDuration - tolerance) {
    throw new Error(`Compressed media is incomplete (${outputDuration}s of ${sourceDuration}s)`);
  }
}

/**
 * @param {string} temporaryPath
 * @param {string} targetPath
 * @param {{ exists(path: string): boolean, rename(from: string, to: string): void, remove(path: string): void }} files
 */
export function replaceWithRollback(temporaryPath, targetPath, files) {
  if (!files.exists(targetPath)) {
    files.rename(temporaryPath, targetPath);
    return;
  }

  const backupPath = `${targetPath}.backup`;
  if (files.exists(backupPath)) {
    throw new Error(`Refusing to replace ${targetPath}; backup already exists at ${backupPath}`);
  }

  files.rename(targetPath, backupPath);
  try {
    files.rename(temporaryPath, targetPath);
  } catch (error) {
    try {
      files.rename(backupPath, targetPath);
    } catch (rollbackError) {
      const recoveryError = new Error(
        `Unable to install ${targetPath} or restore its backup. Recover the original file from ${backupPath}`,
        { cause: error },
      );
      recoveryError.recoveryPath = backupPath;
      recoveryError.rollbackCause = rollbackError;
      throw recoveryError;
    }
    throw error;
  }

  files.remove(backupPath);
}
