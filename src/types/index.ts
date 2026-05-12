export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  repository: string;
  tags: string[];
  type: "skill" | "hook" | "bundle";
  files: string[];
  hooks?: HookDefinition[];
  dependencies?: string[];
  claude_code_version?: string;
}

export interface HookDefinition {
  event: string;
  command: string;
}

export interface RegistryEntry {
  name: string;
  version: string;
  description: string;
  author: string;
  repository: string;
  tags: string[];
  type: "skill" | "hook" | "bundle";
  downloads?: number;
  stars?: number;
}

export interface RegistryIndex {
  version: number;
  updated: string;
  packages: RegistryEntry[];
}

export interface InstalledPackage {
  name: string;
  version: string;
  installedAt: string;
  source: string;
  files: string[];
  type: "skill" | "hook" | "bundle";
}

export interface LockFile {
  version: number;
  packages: Record<string, InstalledPackage>;
}

export interface CcxConfig {
  registryUrl: string;
  claudeDir: string;
  skillsDir: string;
  hooksDir: string;
}
