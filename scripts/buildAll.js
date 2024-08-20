import * as fs from "node:fs/promises";
import * as path from "path";
import * as childProcess from "child_process";

async function buildAll() {
  await fs.rm("dist-release", { recursive: true, force: true });
  await fs.mkdir("dist-release");
  await execa("tauri build");
  await fs.copyFile("./src-tauri/target/release/MonsterSirenDesktop.exe", "./dist-release/MonsterSirenDesktop.exe");
  process.chdir("packages/plugins/ncm_inject");
  await execa("pnpm release");
  await fs.copyFile("./src-rust/target/release/ncm_inject.dll", path.join("..", "..", "..", "dist-release", "plugins", "ncm_inject.dll"));
}

buildAll().catch((e) => {
  console.error(e);
  process.exit(1);
});

function execa(command) {
  return new Promise((resolve, reject) => {
    const child = childProcess.exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}
