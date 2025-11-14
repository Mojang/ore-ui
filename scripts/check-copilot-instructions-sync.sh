#!/bin/bash
# Check for documentation drift between code and Copilot instructions
#
# This script validates that .github/copilot-instructions.md stays in sync with the codebase.
# It is a thin wrapper around check-instructions-sync-core.sh.
#
# Exit codes:
# 0 - All checks passed
# 1 - Documentation drift detected

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call the core script with full mode
exec "$SCRIPT_DIR/check-instructions-sync-core.sh" ".github/copilot-instructions.md" "full"
