#!/usr/bin/env node

import { Command } from "commander";
import { getDefaultConfig } from "./lib/paths.js";
import { searchCommand } from "./commands/search.js";
import { installCommand } from "./commands/install.js";
import { uninstallCommand } from "./commands/uninstall.js";
import { updateCommand } from "./commands/update.js";
import { listCommand } from "./commands/list.js";
import { initCommand } from "./commands/init.js";
import { error } from "./lib/format.js";

const config = getDefaultConfig();

const program = new Command()
  .name("ccx")
  .description("Package manager for Claude Code skills and hooks")
  .version("0.1.0");

program
  .command("search")
  .description("Search the registry for skills and hooks")
  .argument("<query>", "search term")
  .action(async (query: string) => {
    try {
      await searchCommand(query, config);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("install")
  .alias("i")
  .description("Install one or more packages")
  .argument("<names...>", "package names to install")
  .option("-f, --force", "force reinstall if already installed")
  .action(async (names: string[], options: { force?: boolean }) => {
    try {
      await installCommand(names, config, options);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("uninstall")
  .alias("rm")
  .description("Uninstall one or more packages")
  .argument("<names...>", "package names to remove")
  .action(async (names: string[]) => {
    try {
      await uninstallCommand(names, config);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("update")
  .alias("up")
  .description("Update installed packages to latest versions")
  .argument("[names...]", "specific packages to update (default: all)")
  .action(async (names: string[]) => {
    try {
      await updateCommand(names, config);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("list")
  .alias("ls")
  .description("List installed packages")
  .action(async () => {
    try {
      await listCommand(config);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("init")
  .description("Initialize a CLAUDE.md in the current directory")
  .action(async () => {
    try {
      await initCommand();
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program.parse();
