import { parseArgs } from "node:util";
import { checkContent } from "./lib/check-content.ts";
import { formatProblem } from "./lib/problems.ts";

// pnpm check-content [--json] [--ignore-starter] [--allow-placeholders] [--root <dir>]
// --ignore-starter skips the "still a starter value" checks; the build uses it so a fresh
// template still builds. Run without it to find out whether setup is finished.
// --allow-placeholders accepts the placeholder photo, social image and resume, for owners
// who do not have them yet, and lists them as still to replace. Everything else must still be replaced.
// Exits 0 when the content is complete and valid (accepted placeholders aside), 1 with one line
// per problem otherwise.
const { values } = parseArgs({
  options: { json: { type: "boolean" }, "ignore-starter": { type: "boolean" }, "allow-placeholders": { type: "boolean" }, root: { type: "string", default: process.cwd() } },
});

const problems = await checkContent(values.root!, { ignoreStarter: values["ignore-starter"], allowPlaceholders: values["allow-placeholders"] });

const errors = problems.filter((problem) => !problem.warning);
const accepted = problems.filter((problem) => problem.warning);

if (values.json) {
  console.log(JSON.stringify(problems, null, 2));
} else {
  if (errors.length === 0) {
    console.log("check-content: ok");
  } else {
    console.log(`check-content: ${errors.length} problem${errors.length === 1 ? "" : "s"}\n`);
    for (const problem of errors) console.log(`- ${formatProblem(problem)}`);
  }
  if (accepted.length) {
    console.log("\nPlaceholders still in place (tell the owner to replace them):\n");
    for (const problem of accepted) console.log(`- ${formatProblem(problem)}`);
  }
}
process.exit(errors.length ? 1 : 0);
