# Contributing to ccx

Thank you for considering a contribution. This guide covers the two main ways to help.

## Adding a package to the registry

This is the easiest and most impactful contribution.

### Requirements

Your package must:

1. Be a public GitHub repository
2. Contain at least one skill file (`.md`, `.yaml`, `.yml`, `.json`, `.sh`, `.ts`, `.js`, `.py`)
3. Work with Claude Code (tested in at least one real session)
4. Have a clear description of what the skill does

### Steps

1. Fork this repository
2. Edit `registry/index.json` and add your entry:

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "One sentence describing what this skill does",
  "author": "your-github-username",
  "repository": "https://github.com/you/your-repo",
  "tags": ["relevant", "tags"],
  "type": "skill",
  "stars": 0
}
```

3. Open a pull request with the title: `registry: add <package-name>`
4. In the PR description, include a brief explanation of what the skill does and confirm you have tested it

### Naming conventions

- Use lowercase, hyphenated names: `my-skill`, not `MySkill` or `my_skill`
- Keep names short and descriptive
- Do not use the `claude-` prefix (it is redundant in this context)

### Package types

- `skill` -- a CLAUDE.md, skill file, or skill directory that configures Claude Code behavior
- `hook` -- a script or configuration that runs on Claude Code lifecycle events
- `bundle` -- a collection of multiple skills or hooks packaged together

## Contributing to the CLI

### Setup

```sh
git clone https://github.com/Harry89453/ccx.git
cd ccx
npm install
npm run build
```

### Development

```sh
npm run dev       # watch mode rebuild
npm test          # run tests
npm run lint      # type check
```

### Code standards

- TypeScript strict mode
- No unnecessary dependencies
- Write tests for new functionality
- Keep the CLI output clean and consistent with existing formatting

### Pull requests

- One feature or fix per PR
- Include tests
- Update the README if adding a command or changing behavior
- Keep commits focused and descriptive

## Questions

Open an issue if you are unsure about anything. We would rather answer a question than review a PR that goes in the wrong direction.
