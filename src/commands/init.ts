import { writeFile, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import { success, info, warn, error } from "../lib/format.js";

const CLAUDE_MD_TEMPLATE = `# Project Guidelines

## Overview

Describe your project here so Claude understands the context.

## Stack

- Language:
- Framework:
- Testing:

## Conventions

- Follow existing code style
- Write tests for new features
- Keep functions small and focused

## Important Files

- \`src/\` -- source code
- \`tests/\` -- test files
`;

export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const claudeMdPath = join(cwd, "CLAUDE.md");

  try {
    await access(claudeMdPath);
    warn("CLAUDE.md already exists in this directory");
    return;
  } catch {
    // file doesn't exist, good
  }

  const claudeDir = join(cwd, ".claude");
  await mkdir(claudeDir, { recursive: true });
  await writeFile(claudeMdPath, CLAUDE_MD_TEMPLATE, "utf-8");

  success("created CLAUDE.md");
  info("edit CLAUDE.md to describe your project to Claude Code");
}
