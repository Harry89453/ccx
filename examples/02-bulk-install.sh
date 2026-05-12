#!/bin/bash
# Example 2: Install multiple skills at once
#
# ccx accepts multiple package names in a single install command.
# This is the fastest way to set up a new machine.

echo "--- Installing a full skill stack ---"
ccx install karpathy caveman agent-skills mattpocock-skills

echo ""
echo "--- Listing everything installed ---"
ccx ls
