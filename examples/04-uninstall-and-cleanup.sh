#!/bin/bash
# Example 4: Remove skills you no longer need
#
# Uninstalling removes the skill files and cleans up the lock file.

echo "--- Before: installed packages ---"
ccx ls

echo ""
echo "--- Removing caveman skill ---"
ccx uninstall caveman

echo ""
echo "--- After: installed packages ---"
ccx ls
