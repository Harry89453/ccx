#!/bin/bash
# Example 1: Search for a skill and install it
#
# This shows the basic workflow: find a skill, install it,
# and verify it landed in the right place.

echo "--- Searching for coding skills ---"
ccx search coding

echo ""
echo "--- Installing the Karpathy skill ---"
ccx install karpathy

echo ""
echo "--- Verifying installation ---"
ccx ls

echo ""
echo "--- Check the installed files ---"
ls -la ~/.claude/skills/karpathy/
