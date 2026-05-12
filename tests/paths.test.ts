import { describe, it, expect } from "vitest";
import { homedir } from "node:os";
import { join } from "node:path";
import { getDefaultConfig, getLockFilePath, getCacheDir } from "../src/lib/paths.js";

describe("getDefaultConfig", () => {
  it("returns config with paths under home directory", () => {
    const config = getDefaultConfig();
    const home = homedir();
    expect(config.claudeDir).toBe(join(home, ".claude"));
    expect(config.skillsDir).toBe(join(home, ".claude", "skills"));
    expect(config.hooksDir).toBe(join(home, ".claude", "hooks"));
  });

  it("has a valid registry URL", () => {
    const config = getDefaultConfig();
    expect(config.registryUrl).toMatch(/^https:\/\//);
    expect(config.registryUrl).toContain("registry/index.json");
  });
});

describe("getLockFilePath", () => {
  it("returns lock file path in claude directory", () => {
    const config = getDefaultConfig();
    const path = getLockFilePath(config);
    expect(path).toBe(join(homedir(), ".claude", "ccx-lock.json"));
  });
});

describe("getCacheDir", () => {
  it("returns cache dir under home", () => {
    const dir = getCacheDir();
    expect(dir).toBe(join(homedir(), ".cache", "ccx"));
  });
});
