import type { CcxConfig } from "../types/index.js";
import { fetchRegistry, searchPackages } from "../lib/registry.js";
import { formatRegistryEntry, info, warn } from "../lib/format.js";

export async function searchCommand(
  query: string,
  config: CcxConfig
): Promise<void> {
  info(`searching for "${query}"...`);
  const index = await fetchRegistry(config.registryUrl);
  const results = searchPackages(index, query);

  if (results.length === 0) {
    warn(`no packages found for "${query}"`);
    return;
  }

  console.log();
  console.log(`  Found ${results.length} package${results.length === 1 ? "" : "s"}:\n`);
  for (const entry of results) {
    console.log(formatRegistryEntry(entry));
    console.log();
  }
}
