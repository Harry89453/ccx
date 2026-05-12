import type { CcxConfig } from "../types/index.js";
import { fetchRegistry, getPackage } from "../lib/registry.js";
import { installPackage, isInstalled } from "../lib/installer.js";
import { success, info, warn, error } from "../lib/format.js";

export async function installCommand(
  names: string[],
  config: CcxConfig,
  options: { force?: boolean }
): Promise<void> {
  if (names.length === 0) {
    error("specify at least one package name");
    process.exit(1);
  }

  const index = await fetchRegistry(config.registryUrl);

  for (const name of names) {
    const entry = getPackage(index, name);
    if (!entry) {
      error(`package "${name}" not found in registry`);
      continue;
    }

    const installed = await isInstalled(config, name);
    if (installed && !options.force) {
      warn(`"${name}" is already installed (use --force to reinstall)`);
      continue;
    }

    info(`installing ${name}@${entry.version}...`);

    try {
      const result = await installPackage(config, entry);
      success(`${name}@${result.version} (${result.files.length} files)`);
    } catch (err) {
      error(`failed to install "${name}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
