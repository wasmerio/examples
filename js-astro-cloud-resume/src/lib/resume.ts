/**
 * Loads and validates the resume data file (`data` in src/config.ts,
 * `src/data/resume.yaml` by default) at build time.
 * A mistake in the file stops the build with a readable list of problems.
 */
import { parse, YAMLParseError } from 'yaml';
import { brand, dataFile as FILE, dataRaw as raw } from 'virtual:cloud-resume/build';
import { brandInfo } from '../brands';
import { makeResumeSchema, type Resume } from './schema';

function load(): Resume {
  let data: unknown;
  try {
    data = parse(raw, { prettyErrors: true });
  } catch (error) {
    const detail = error instanceof YAMLParseError ? error.message : String(error);
    throw new Error(`${FILE} is not valid YAML:\n${detail}`);
  }

  const result = makeResumeSchema(brandInfo[brand].issuer).safeParse(data);
  if (!result.success) {
    const lines = result.error.issues.map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : '(root)';
      return `  - ${path}: ${issue.message}`;
    });
    throw new Error(
      `${FILE} does not match the expected format:\n${lines.join('\n')}\n` +
        'See the "Data file reference" section of the README.',
    );
  }
  return result.data;
}

export const resume: Resume = load();
