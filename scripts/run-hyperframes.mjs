import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const cliPath = path.join(root, "packages", "cli", "dist", "cli.js");

if (!existsSync(cliPath)) {
  throw new Error(
    "Missing packages/cli/dist/cli.js. Install Bun, run bun install, then run bun run build.",
  );
}

const result = spawnSync(process.execPath, [cliPath, ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
