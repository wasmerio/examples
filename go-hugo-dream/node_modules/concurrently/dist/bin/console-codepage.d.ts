import { spawnSync as baseSpawnSync } from 'node:child_process';
export type SpawnSync = typeof baseSpawnSync;
/**
 * On Windows, concurrently pipes child-process output through a freshly-allocated console whose
 * codepage may not be UTF-8, garbling non-ASCII output from commands that rely on it (see
 * open-cli-tools/concurrently#302). This sets the console's codepage to UTF-8 once, which spawned
 * children then inherit, and returns a function that restores the original codepage.
 *
 * No-ops (and never throws) if not on Windows, if the codepage is already UTF-8, or if reading/setting
 * it fails for any reason -- this is a best-effort convenience, never something that should block
 * concurrently from running.
 */
export declare function ensureUtf8Codepage(spawnSync?: SpawnSync, process?: Pick<NodeJS.Process, 'platform'>): () => void;
