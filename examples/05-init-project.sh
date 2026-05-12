#!/bin/bash
# Example 5: Initialize a new project with CLAUDE.md
#
# Use `ccx init` in any project directory to scaffold a
# CLAUDE.md file that helps Claude Code understand your project.

mkdir -p /tmp/my-new-project
cd /tmp/my-new-project

echo "--- Initializing CLAUDE.md ---"
ccx init

echo ""
echo "--- Generated file ---"
cat CLAUDE.md

# Clean up
cd -
rm -rf /tmp/my-new-project
