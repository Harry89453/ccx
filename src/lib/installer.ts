import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { join, basename } from "node:path";
import type {
  CcxConfig,
  InstalledPackage,
  RegistryEntry,
} from "../types/index.js";
import { addToLockFile, removeFromLockFile, readLockFile } from "./lockfile.js";

interface GitHubTreeItem {
  path: string;
  type: string;
  url?: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubBlobResponse {
  content: string;
  encoding: string;
}

function parseGitHubRepo(repoUrl: string): { owner: string; repo: string } {
  const cleaned = repoUrl.replace(/\.git$/, "").replace(/\/$/, "");
  const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error(`Invalid GitHub URL: ${repoUrl}`);
  return { owner: match[1], repo: match[2] };
}

async function fetchRepoTree(
  owner: string,
  repo: string,
  branch = "main"
): Promise<GitHubTreeItem[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    if (res.status === 404 && branch === "main") {
      return fetchRepoTree(owner, repo, "master");
    }
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = (await res.json()) as GitHubTreeResponse;
  return data.tree;
}

async function fetchFileContent(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);
  const data = (await res.json()) as GitHubBlobResponse;
  if (data.encoding === "base64") {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return data.content;
}

function getSkillFiles(tree: GitHubTreeItem[]): GitHubTreeItem[] {
  const skillExtensions = [".md", ".yaml", ".yml", ".json", ".sh", ".ts", ".js", ".py"];
  const skipDirs = ["node_modules", ".git", "dist", "build", "test", "tests"];
  return tree.filter((item) => {
    if (item.type !== "blob") return false;
    const lower = item.path.toLowerCase();
    if (skipDirs.some((d) => lower.startsWith(d + "/"))) return false;
    if (lower === "package.json" || lower === "tsconfig.json") return false;
    if (lower === "license" || lower === "license.md") return false;
    return skillExtensions.some((ext) => lower.endsWith(ext));
  });
}

export async function installPackage(
  config: CcxConfig,
  entry: RegistryEntry
): Promise<InstalledPackage> {
  const { owner, repo } = parseGitHubRepo(entry.repository);
  const tree = await fetchRepoTree(owner, repo);
  const files = getSkillFiles(tree);

  if (files.length === 0) {
    throw new Error(`No skill files found in ${entry.repository}`);
  }

  const targetDir =
    entry.type === "hook"
      ? join(config.hooksDir, entry.name)
      : join(config.skillsDir, entry.name);

  await mkdir(targetDir, { recursive: true });

  const installedFiles: string[] = [];

  for (const file of files) {
    if (!file.url) continue;
    const content = await fetchFileContent(file.url);
    const targetPath = join(targetDir, file.path);
    await mkdir(join(targetPath, ".."), { recursive: true });
    await writeFile(targetPath, content, "utf-8");
    installedFiles.push(file.path);
  }

  const installed: InstalledPackage = {
    name: entry.name,
    version: entry.version,
    installedAt: new Date().toISOString(),
    source: entry.repository,
    files: installedFiles,
    type: entry.type,
  };

  await addToLockFile(config, installed);
  return installed;
}

export async function uninstallPackage(
  config: CcxConfig,
  name: string
): Promise<void> {
  const lock = await readLockFile(config);
  const pkg = lock.packages[name];
  if (!pkg) throw new Error(`Package "${name}" is not installed`);

  const targetDir =
    pkg.type === "hook"
      ? join(config.hooksDir, name)
      : join(config.skillsDir, name);

  await rm(targetDir, { recursive: true, force: true });
  await removeFromLockFile(config, name);
}

export async function listInstalled(
  config: CcxConfig
): Promise<InstalledPackage[]> {
  const lock = await readLockFile(config);
  return Object.values(lock.packages);
}

export async function isInstalled(
  config: CcxConfig,
  name: string
): Promise<boolean> {
  const lock = await readLockFile(config);
  return name in lock.packages;
}
