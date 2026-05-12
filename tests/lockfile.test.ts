import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readLockFile,
  writeLockFile,
  addToLockFile,
  removeFromLockFile,
} from "../src/lib/lockfile.js";
import type { CcxConfig, InstalledPackage, LockFile } from "../src/types/index.js";

let tempDir: string;
let config: CcxConfig;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "ccx-test-"));
  config = {
    registryUrl: "https://example.com/registry.json",
    claudeDir: tempDir,
    skillsDir: join(tempDir, "skills"),
    hooksDir: join(tempDir, "hooks"),
  };
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("readLockFile", () => {
  it("returns empty lock file when none exists", async () => {
    const lock = await readLockFile(config);
    expect(lock.version).toBe(1);
    expect(Object.keys(lock.packages)).toHaveLength(0);
  });

  it("reads existing lock file", async () => {
    const existing: LockFile = {
      version: 1,
      packages: {
        karpathy: {
          name: "karpathy",
          version: "1.0.0",
          installedAt: "2026-05-12T00:00:00.000Z",
          source: "https://github.com/forrestchang/andrej-karpathy-skills",
          files: ["CLAUDE.md"],
          type: "skill",
        },
      },
    };
    await writeLockFile(config, existing);
    const lock = await readLockFile(config);
    expect(lock.packages.karpathy).toBeDefined();
    expect(lock.packages.karpathy.version).toBe("1.0.0");
  });
});

describe("addToLockFile", () => {
  it("adds a package to an empty lock file", async () => {
    const pkg: InstalledPackage = {
      name: "test-pkg",
      version: "0.1.0",
      installedAt: new Date().toISOString(),
      source: "https://github.com/test/test-pkg",
      files: ["skill.md"],
      type: "skill",
    };
    await addToLockFile(config, pkg);
    const lock = await readLockFile(config);
    expect(lock.packages["test-pkg"]).toBeDefined();
    expect(lock.packages["test-pkg"].version).toBe("0.1.0");
  });

  it("overwrites existing package entry", async () => {
    const pkg1: InstalledPackage = {
      name: "test-pkg",
      version: "0.1.0",
      installedAt: new Date().toISOString(),
      source: "https://github.com/test/test-pkg",
      files: ["old.md"],
      type: "skill",
    };
    const pkg2: InstalledPackage = {
      ...pkg1,
      version: "0.2.0",
      files: ["new.md"],
    };
    await addToLockFile(config, pkg1);
    await addToLockFile(config, pkg2);
    const lock = await readLockFile(config);
    expect(lock.packages["test-pkg"].version).toBe("0.2.0");
    expect(lock.packages["test-pkg"].files).toEqual(["new.md"]);
  });
});

describe("removeFromLockFile", () => {
  it("removes a package", async () => {
    const pkg: InstalledPackage = {
      name: "removable",
      version: "1.0.0",
      installedAt: new Date().toISOString(),
      source: "https://github.com/test/removable",
      files: ["file.md"],
      type: "skill",
    };
    await addToLockFile(config, pkg);
    await removeFromLockFile(config, "removable");
    const lock = await readLockFile(config);
    expect(lock.packages["removable"]).toBeUndefined();
  });

  it("does not throw when removing nonexistent package", async () => {
    await expect(
      removeFromLockFile(config, "ghost")
    ).resolves.not.toThrow();
  });
});
