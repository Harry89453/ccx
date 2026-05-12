#!/bin/bash
# Example 3: Keep skills up to date
#
# Skill authors push updates regularly. This shows how to
# check for and apply updates across all installed packages.

echo "--- Current installed packages ---"
ccx ls

echo ""
echo "--- Updating all packages ---"
ccx update

echo ""
echo "--- Update a specific package only ---"
ccx update karpathy
