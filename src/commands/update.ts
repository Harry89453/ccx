import type { CcxConfig } from "../types/index.js";
import { fetchRegistry, getPackage } from "../lib/registry.js";
import { listInstalled, installPackage, uninstallPackage } from "../lib/installer.js";
import { success, info, warn, error } from "../lib/format.js";
import { lt } from "semver";

export async function updateCommand(
  names: string[],
  config: CcxConfig
): Promise<void> {
  const index = await fetchRegistry(config.registryUrl);
  const installed = await listInstalled(config);

  if (installed.length === 0) {
    warn("no packages installed");
    return;
  }

  const toUpdate =
    names.length > 0
      ? installed.filter((p) => names.includes(p.name))
      : installed;

  if (toUpdate.length === 0) {
    warn("none of the specified packages are installed");
    return;
  }

  let updated = 0;

  for (const pkg of toUpdate) {
    const entry = getPackage(index, pkg.name);
    if (!entry) {
      warn(`"${pkg.name}" no longer in registry, skipping`);
      continue;
    }

    if (!lt(pkg.version, entry.version)) {
      info(`${pkg.name}@${pkg.version} is up to date`);
      continue;
    }

    info(`updating ${pkg.name} ${pkg.version} -> ${entry.version}...`);

    try {
      await uninstallPackage(config, pkg.name);
      await installPackage(config, entry);
      success(`${pkg.name}@${entry.version}`);
      updated++;
    } catch (err) {
      error(
        `failed to update "${pkg.name}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (updated === 0) {
    info("everything is up to date");
  } else {
    success(`updated ${updated} package${updated === 1 ? "" : "s"}`);
  }
}
