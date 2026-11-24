import fs from 'node:fs';
import path from 'node:path';
import { up } from 'empathic/package';
import { createDebug } from 'obug';
import convertSourceMap from 'convert-source-map';

const debug = createDebug("babel:transform:file");
function getInputMapPath(filename, root, inputMapURL) {
  const inputFileDir = path.dirname(filename);
  const inputMapPath = path.resolve(inputFileDir, inputMapURL);
  const relativeToInputFileDir = path.relative(inputFileDir, inputMapPath);
  if (relativeToInputFileDir.startsWith("..") || path.isAbsolute(relativeToInputFileDir)) {
    const inputPackageJSONPath = up({
      cwd: inputFileDir,
      last: root
    });
    const inputFileRoot = inputPackageJSONPath ? path.dirname(inputPackageJSONPath) : root;
    const relativeInputMapPath = path.relative(inputFileRoot, inputMapPath);
    if (relativeInputMapPath.startsWith("..") || path.isAbsolute(relativeInputMapPath)) {
      debug(`discarding input sourcemap "${inputMapPath}" outside of package root "${inputFileRoot}"`);
      return null;
    }
  }
  return inputMapPath;
}
function readInputSourceMapFile(filename, root, inputMapURL) {
  const inputMapPath = getInputMapPath(filename, root, inputMapURL);
  if (inputMapPath) {
    const inputMapContent = fs.readFileSync(inputMapPath, "utf8");
    return convertSourceMap.fromJSON(inputMapContent);
  }
  return null;
}

export { readInputSourceMapFile as default };
