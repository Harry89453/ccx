import pc from "picocolors";
import type { RegistryEntry, InstalledPackage } from "../types/index.js";

export function formatRegistryEntry(entry: RegistryEntry): string {
  const stars = entry.stars ? pc.yellow(` [${entry.stars.toLocaleString()} stars]`) : "";
  const tags = entry.tags.length > 0 ? pc.dim(` (${entry.tags.join(", ")})`) : "";
  return [
    `  ${pc.bold(pc.cyan(entry.name))}@${entry.version}${stars}`,
    `  ${entry.description}${tags}`,
    `  ${pc.dim(entry.repository)}`,
  ].join("\n");
}

export function formatInstalledPackage(pkg: InstalledPackage): string {
  const age = getRelativeTime(new Date(pkg.installedAt));
  return [
    `  ${pc.bold(pc.green(pkg.name))}@${pkg.version}`,
    `  ${pc.dim(`installed ${age} from ${pkg.source}`)}`,
    `  ${pc.dim(`${pkg.files.length} file${pkg.files.length === 1 ? "" : "s"}, type: ${pkg.type}`)}`,
  ].join("\n");
}

function getRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function success(msg: string): void {
  console.log(pc.green("  done") + " " + msg);
}

export function info(msg: string): void {
  console.log(pc.cyan("  info") + " " + msg);
}

export function warn(msg: string): void {
  console.log(pc.yellow("  warn") + " " + msg);
}

export function error(msg: string): void {
  console.error(pc.red("  error") + " " + msg);
}
