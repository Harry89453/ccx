import type { CcxConfig } from "../types/index.js";
import { listInstalled } from "../lib/installer.js";
import { formatInstalledPackage, info } from "../lib/format.js";

export async function listCommand(config: CcxConfig): Promise<void> {
  const packages = await listInstalled(config);

  if (packages.length === 0) {
    info("no packages installed. Run `ccx search` to find packages.");
    return;
  }

  console.log();
  console.log(`  ${packages.length} package${packages.length === 1 ? "" : "s"} installed:\n`);
  for (const pkg of packages) {
    console.log(formatInstalledPackage(pkg));
    console.log();
  }
}
