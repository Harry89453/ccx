import { homedir } from "node:os";
import { join } from "node:path";
import type { CcxConfig } from "../types/index.js";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/Harry89453/ccx/main/registry/index.json";

export function getDefaultConfig(): CcxConfig {
  const claudeDir = join(homedir(), ".claude");
  return {
    registryUrl: REGISTRY_URL,
    claudeDir,
    skillsDir: join(claudeDir, "skills"),
    hooksDir: join(claudeDir, "hooks"),
  };
}

export function getLockFilePath(config: CcxConfig): string {
  return join(config.claudeDir, "ccx-lock.json");
}

export function getCacheDir(): string {
  return join(homedir(), ".cache", "ccx");
}
