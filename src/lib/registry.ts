import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { RegistryEntry, RegistryIndex } from "../types/index.js";
import { getCacheDir } from "./paths.js";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function getCachedRegistry(): Promise<RegistryIndex | null> {
  const cachePath = join(getCacheDir(), "registry.json");
  try {
    const info = await stat(cachePath);
    if (Date.now() - info.mtimeMs > CACHE_TTL_MS) return null;
    const raw = await readFile(cachePath, "utf-8");
    return JSON.parse(raw) as RegistryIndex;
  } catch {
    return null;
  }
}

async function cacheRegistry(index: RegistryIndex): Promise<void> {
  const cacheDir = getCacheDir();
  await mkdir(cacheDir, { recursive: true });
  await writeFile(
    join(cacheDir, "registry.json"),
    JSON.stringify(index),
    "utf-8"
  );
}

export async function fetchRegistry(
  registryUrl: string
): Promise<RegistryIndex> {
  const cached = await getCachedRegistry();
  if (cached) return cached;

  const response = await fetch(registryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.status} ${response.statusText}`);
  }
  const index = (await response.json()) as RegistryIndex;
  await cacheRegistry(index);
  return index;
}

export function searchPackages(
  index: RegistryIndex,
  query: string
): RegistryEntry[] {
  const lower = query.toLowerCase();
  return index.packages
    .filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(lower) ||
        pkg.description.toLowerCase().includes(lower) ||
        pkg.tags.some((t) => t.toLowerCase().includes(lower))
    )
    .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
}

export function getPackage(
  index: RegistryIndex,
  name: string
): RegistryEntry | undefined {
  return index.packages.find(
    (pkg) => pkg.name.toLowerCase() === name.toLowerCase()
  );
}
