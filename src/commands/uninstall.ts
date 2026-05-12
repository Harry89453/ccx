import type { CcxConfig } from "../types/index.js";
import { uninstallPackage } from "../lib/installer.js";
import { success, error } from "../lib/format.js";

export async function uninstallCommand(
  names: string[],
  config: CcxConfig
): Promise<void> {
  if (names.length === 0) {
    error("specify at least one package name");
    process.exit(1);
  }

  for (const name of names) {
    try {
      await uninstallPackage(config, name);
      success(`removed ${name}`);
    } catch (err) {
      error(
        `failed to uninstall "${name}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
}
