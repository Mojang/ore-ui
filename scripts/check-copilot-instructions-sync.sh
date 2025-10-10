#!/bin/bash
# Check for documentation drift between code and Copilot instructions
#
# This script validates that .github/copilot-instructions.md stays in sync with the codebase.
# It checks:
# - All hooks mentioned in instructions exist in the code
# - All hooks in code are documented
# - Core components are documented
# - All packages exist
# - Import paths are correct
#
# Exit codes:
# 0 - All checks passed
# 1 - Documentation drift detected

set -e

INSTRUCTIONS_FILE=".github/copilot-instructions.md"
ERRORS=0

echo "🔍 Checking for documentation drift..."
echo ""

# ============================================================================
# CHECK 1: Verify all hooks mentioned in instructions exist in the codebase
# ============================================================================
echo "📋 Checking hooks..."
grep -o "useFacet[A-Za-z]*" "$INSTRUCTIONS_FILE" | sort -u | while read -r hook; do
  # Search for the hook as either a function export or const export
  if ! grep -r "export.*function $hook" packages/@react-facet/core/src/hooks/ > /dev/null 2>&1 && \
     ! grep -r "export.*$hook.*=" packages/@react-facet/core/src/hooks/ > /dev/null 2>&1; then
    echo "⚠️  Hook '$hook' mentioned in instructions but not found in code"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ $hook"
  fi
done

# ============================================================================
# CHECK 2: Verify all hooks in code are documented in instructions
# ============================================================================
echo ""
echo "📋 Checking if code hooks are documented..."
find packages/@react-facet/core/src/hooks -name "useFacet*.ts" -o -name "useFacet*.tsx" | while read -r file; do
  # Extract the hook name from the file path (remove .spec and extension)
  hook=$(basename "$file" | sed 's/\.spec\.tsx\?$//' | sed 's/\.tsx\?$//')

  # Check if the hook name appears in the instructions
  if ! grep -q "$hook" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  Hook '$hook' exists in code but not documented in instructions"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ $hook"
  fi
done

# ============================================================================
# CHECK 3: Verify core components are documented
# ============================================================================
echo ""
echo "📦 Checking components..."
for component in "Map" "Mount" "With"; do
  if ! grep -q "$component" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  Component '$component' not documented in instructions"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ $component"
  fi
done

# ============================================================================
# CHECK 4: Verify all packages mentioned in instructions exist
# ============================================================================
echo ""
echo "📦 Checking packages..."
for package in "core" "dom-fiber" "dom-fiber-testing-library" "shared-facet"; do
  if [ ! -d "packages/@react-facet/$package" ]; then
    echo "⚠️  Package '$package' mentioned in instructions but doesn't exist"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ @react-facet/$package"
  fi
done

# ============================================================================
# CHECK 5: Verify import examples reference real packages
# ============================================================================
echo ""
echo "📥 Checking import paths..."

# Check @react-facet/core imports
if grep -q "from '@react-facet/core'" "$INSTRUCTIONS_FILE"; then
  if [ -d "packages/@react-facet/core" ]; then
    echo "✓ @react-facet/core imports"
  fi
fi

# Check @react-facet/dom-fiber imports
if grep -q "from '@react-facet/dom-fiber'" "$INSTRUCTIONS_FILE"; then
  if [ -d "packages/@react-facet/dom-fiber" ]; then
    echo "✓ @react-facet/dom-fiber imports"
  fi
fi

# Check @react-facet/dom-fiber-testing-library imports
if grep -q "from '@react-facet/dom-fiber-testing-library'" "$INSTRUCTIONS_FILE"; then
  if [ -d "packages/@react-facet/dom-fiber-testing-library" ]; then
    echo "✓ @react-facet/dom-fiber-testing-library imports"
  fi
fi

# ============================================================================
# FINAL RESULT
# ============================================================================
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Documentation sync check passed!"
  exit 0
else
  echo "❌ Found $ERRORS potential documentation drift issue(s)"
  echo ""
  echo "Please update .github/copilot-instructions.md to match the current codebase."
  exit 1
fi
