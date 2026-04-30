import { access, copyFile, cp, mkdir } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const staticDirectories = ["img", "js", "styles"];
const staticFiles = ["_redirects"];

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyStaticDirectory(dirName) {
  const sourcePath = path.join(rootDir, dirName);
  const destinationPath = path.join(distDir, dirName);
  if (!(await exists(sourcePath))) {
    return;
  }
  await cp(sourcePath, destinationPath, { recursive: true, force: true });
}

async function copyStaticFile(fileName) {
  const sourcePath = path.join(rootDir, fileName);
  const destinationPath = path.join(distDir, fileName);
  if (!(await exists(sourcePath))) {
    return;
  }
  await copyFile(sourcePath, destinationPath);
}

await mkdir(distDir, { recursive: true });

for (const dirName of staticDirectories) {
  await copyStaticDirectory(dirName);
}

for (const fileName of staticFiles) {
  await copyStaticFile(fileName);
}
