import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";

await rm(path.resolve(".next"), { recursive: true, force: true });
await rm(path.resolve("out"), { recursive: true, force: true });

const nextCli = path.resolve("node_modules/next/dist/bin/next");
const build = spawnSync(process.execPath, [nextCli, "build"], {
  env: { ...process.env, STATIC_EXPORT: "1" },
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
