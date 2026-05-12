# ccx

Package manager for Claude Code skills and hooks.

## Architecture

- `src/index.ts` -- CLI entry point using Commander
- `src/commands/` -- one file per CLI command (search, install, uninstall, update, list, init)
- `src/lib/` -- shared logic (registry fetching, file installation, lock file management, output formatting)
- `src/types/` -- TypeScript type definitions
- `registry/index.json` -- curated package registry
- `tests/` -- Vitest test suite

## Stack

- TypeScript (strict mode, ES2022 target)
- Commander for CLI parsing
- picocolors for terminal output
- semver for version comparison
- Vitest for testing
- tsup for bundling

## Key decisions

- Skills install to `~/.claude/skills/<name>/`, hooks to `~/.claude/hooks/<name>/`
- Lock file at `~/.claude/ccx-lock.json` tracks installed packages
- Registry is a flat JSON file hosted on GitHub (no database, no server)
- GitHub API used for fetching repo contents (no git clone needed)
- Zero runtime compilation -- skills are plain files Claude Code reads directly

## Testing

Run `npm test` to execute the test suite. Tests cover registry search, lock file operations, and path configuration. Tests use temp directories and do not modify the real `~/.claude/` directory.

## Conventions

- No emojis in code, output, or documentation
- Keep CLI output terse and scannable
- Prefix output lines with status words: `done`, `info`, `warn`, `error`
- Minimal dependencies -- every dependency is a maintenance cost
