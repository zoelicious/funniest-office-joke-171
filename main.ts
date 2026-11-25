// The Funniest Office Joke — make.fun #171
//
// Entry program (program/v1 harness, no network).
// Writes exactly one joke — a single line of office humour —
// to entry.txt inside the harness output directory.
//
// The joke itself is fixed by the tournament assignment:
// a setup about an HR leave request, then a turn that makes
// the office itself the punchline. Nothing here is random,
// nothing is fetched, and the output is byte-identical on
// every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The assigned entry text. Do not edit: this exact string,
// character for character, is the submission.
const JOKE =
  "HR approved my leave request in 3 seconds, which is the fastest anything has ever moved in this office, including the fire drill.";

// The harness gate accepts 1..200 UTF-8 characters of
// non-whitespace text. The joke is 129 characters, so it
// fits with room to spare — but we check anyway so a
// future typo can never silently produce a bad entry.
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

function checkJoke(text) {
  if (typeof text !== "string") {
    throw new Error("joke must be a string");
  }
  if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) {
    throw new Error(
      "joke must be " + MIN_LENGTH + ".." + MAX_LENGTH + " characters, got " + text.length
    );
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  return text;
}

// Resolve the output directory. The harness sets
// MAKEFUN_OUTPUT_DIR; when it is absent we fall back to
// the directory that holds this file's parent, resolved
// to an absolute path from import.meta.url — never a
// relative path, so the result does not depend on cwd.
function resolveOutputDir() {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return resolve(fromEnv);
  }
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "..", "out");
}

function main() {
  const text = checkJoke(JOKE);
  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  // Write the joke exactly as-is: no trailing newline,
  // no extra whitespace, so entry.txt holds 129 bytes.
  // A trailing newline would still pass the 1..200 gate,
  // but keeping the file byte-exact to the assigned text
  // leaves nothing for the judge to trim or misread.
  writeFileSync(target, text, "utf8");
  console.log("wrote " + target + " (" + text.length + " characters)");
}

main();
