import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { CcxConfig, InstalledPackage, LockFile } from "../types/index.js";
import { getLockFilePath } from "./paths.js";

export async function readLockFile(config: CcxConfig): Promise<LockFile> {
  const path = getLockFilePath(config);
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as LockFile;
  } catch {
    return { version: 1, packages: {} };
  }
}

export async function writeLockFile(
  config: CcxConfig,
  lock: LockFile
): Promise<void> {
  const path = getLockFilePath(config);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(lock, null, 2) + "\n", "utf-8");
}

export async function addToLockFile(
  config: CcxConfig,
  pkg: InstalledPackage
): Promise<void> {
  const lock = await readLockFile(config);
  lock.packages[pkg.name] = pkg;
  await writeLockFile(config, lock);
}

export async function removeFromLockFile(
  config: CcxConfig,
  name: string
): Promise<void> {
  const lock = await readLockFile(config);
  delete lock.packages[name];
  await writeLockFile(config, lock);
}
