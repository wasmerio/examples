import { relative, isAbsolute } from 'node:path';

export function verifyIsolation(root, dependency) {
  const path = relative(root, dependency);
  if (path === '..' || path.startsWith('../') || isAbsolute(path)) {
    throw new Error('Dependency outside starter root');
  }
  return true;
}
