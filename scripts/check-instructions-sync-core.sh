#!/bin/bash
# Core documentation drift checker
#
# This script validates that instruction files stay in sync with the codebase.
# It is designed to be called by wrapper scripts that specify which file to check
# and what validation mode to use.
#
# Usage:
#   ./check-instructions-sync-core.sh <instructions_file> <mode>
#
# Arguments:
#   instructions_file - Path to the instructions markdown file
#   mode             - Validation mode: "full" or "public-api"
#
# Exit codes:
#   0 - All checks passed
#   1 - Documentation drift detected
#   2 - Invalid arguments

set -e

# ============================================================================
# ARGUMENT PARSING
# ============================================================================
if [ $# -ne 2 ]; then
  echo "Usage: $0 <instructions_file> <mode>"
  echo "  instructions_file: Path to instructions markdown file"
  echo "  mode: 'full' or 'public-api'"
  exit 2
fi

INSTRUCTIONS_FILE="$1"
MODE="$2"

if [ ! -f "$INSTRUCTIONS_FILE" ]; then
  echo "Error: Instructions file '$INSTRUCTIONS_FILE' not found"
  exit 2
fi

if [ "$MODE" != "full" ] && [ "$MODE" != "public-api" ]; then
  echo "Error: Mode must be 'full' or 'public-api'"
  exit 2
fi

ERRORS=0

# Set display messages based on mode
if [ "$MODE" = "public-api" ]; then
  DOC_TYPE="public API documentation"
  DOC_NAME="public API docs"
else
  DOC_TYPE="documentation"
  DOC_NAME="instructions"
fi

echo "🔍 Checking for $DOC_TYPE drift..."
echo ""

# ============================================================================
# CHECK 1: Verify all hooks mentioned in instructions exist in the codebase
# ============================================================================
echo "📋 Checking hooks..."
HOOKS_IN_DOCS=$(grep -o "useFacet[A-Za-z]*" "$INSTRUCTIONS_FILE" | sort -u)
for hook in $HOOKS_IN_DOCS; do
  # Search for the hook as either a function export or const export
  if ! grep -r "export.*function $hook" packages/@react-facet/core/src/hooks/ > /dev/null 2>&1 && \
     ! grep -r "export.*$hook.*=" packages/@react-facet/core/src/hooks/ > /dev/null 2>&1; then
    echo "⚠️  Hook '$hook' mentioned in $DOC_NAME but not found in code"
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

# Get all hooks from the core package's hooks index.ts (this lists all public hooks)
if [ -f "packages/@react-facet/core/src/hooks/index.ts" ]; then
  HOOKS_IN_CODE=$(grep "export.*from" packages/@react-facet/core/src/hooks/index.ts | \
    grep -o "useFacet[A-Za-z]*" | sort -u)

  for hook in $HOOKS_IN_CODE; do
    if ! grep -q "$hook" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  Hook '$hook' exists in code but not documented in $DOC_NAME"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ $hook"
    fi
  done
else
  echo "⚠️  Cannot find hooks/index.ts to verify hooks"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# CHECK 3: Verify core components are documented
# ============================================================================
echo ""
echo "📦 Checking components..."

# Dynamically get all exported components from the components index.ts
if [ -f "packages/@react-facet/core/src/components/index.ts" ]; then
  COMPONENTS=$(grep "export.*from" packages/@react-facet/core/src/components/index.ts | \
    grep -o "'\.\/[A-Za-z]*'" | \
    sed "s/'\.\/\(.*\)'/\1/" | \
    sort -u)

  for component in $COMPONENTS; do
    # Check for component as JSX tag (<Component) or in backticks (`Component`)
    # This prevents false positives like "Unwrap" matching "useFacetUnwrap"
    if ! grep -q "<$component" "$INSTRUCTIONS_FILE" && ! grep -q "\`$component\`" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  Component '$component' exists in code but not documented in $DOC_NAME"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ $component"
    fi
  done
else
  echo "⚠️  Cannot find components/index.ts to verify components"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# CHECK 4: Verify packages exist and are documented
# ============================================================================
echo ""
echo "📦 Checking packages..."

if [ "$MODE" = "public-api" ]; then
  # Public API mode: only check public packages
  PACKAGES="core dom-fiber shared-facet"

  for package in $PACKAGES; do
    if [ ! -d "packages/@react-facet/$package" ]; then
      echo "⚠️  Public package '$package' mentioned in docs but doesn't exist"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ @react-facet/$package"
    fi

    # Verify package is documented
    if ! grep -q "@react-facet/$package" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  Package '@react-facet/$package' exists but not documented in $DOC_NAME"
      ERRORS=$((ERRORS + 1))
    fi
  done

  # Verify testing library is NOT featured in public docs
  if grep -q "@react-facet/dom-fiber-testing-library" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  Testing library should not be in public API docs (it's for internal use)"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ Testing library correctly omitted from public API docs"
  fi
else
  # Full mode: check all packages including testing library
  PACKAGES="core dom-fiber dom-fiber-testing-library shared-facet"

  for package in $PACKAGES; do
    if [ ! -d "packages/@react-facet/$package" ]; then
      echo "⚠️  Package '$package' mentioned in instructions but doesn't exist"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ @react-facet/$package"
    fi
  done
fi

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

# Check @react-facet/shared-facet imports
if grep -q "from '@react-facet/shared-facet'" "$INSTRUCTIONS_FILE"; then
  if [ -d "packages/@react-facet/shared-facet" ]; then
    echo "✓ @react-facet/shared-facet imports"
  fi
fi

# Only check testing library imports in full mode
if [ "$MODE" = "full" ]; then
  if grep -q "from '@react-facet/dom-fiber-testing-library'" "$INSTRUCTIONS_FILE"; then
    if [ -d "packages/@react-facet/dom-fiber-testing-library" ]; then
      echo "✓ @react-facet/dom-fiber-testing-library imports"
    fi
  fi
fi

# ============================================================================
# CHECK 6: Public API specific checks
# ============================================================================
if [ "$MODE" = "public-api" ]; then
  echo ""
  echo "🔑 Checking critical concepts..."

  # Check that NO_VALUE is explained
  if ! grep -q "NO_VALUE" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  NO_VALUE concept not documented (critical for public API)"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ NO_VALUE"
  fi

  # Check that dual dependency arrays are explained
  if ! grep -q "Two Dependency Arrays" "$INSTRUCTIONS_FILE" && \
     ! grep -q "two dependency arrays" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  Dual dependency arrays not explained (critical pattern)"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ Dual dependency arrays"
  fi

  # Check that fast-* components are documented
  if ! grep -q "fast-" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  fast-* components not documented (core feature)"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ fast-* components"
  fi

  # Check that createRoot is documented (not deprecated render)
  if grep -q "## Mounting" "$INSTRUCTIONS_FILE" || grep -q "### Mounting" "$INSTRUCTIONS_FILE"; then
    if ! grep -q "createRoot" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  createRoot not documented (primary mounting API)"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ createRoot"
    fi
  fi

  echo ""
  echo "⚖️  Checking equality checks..."
  for check in "strictEqualityCheck" "shallowObjectEqualityCheck" "shallowArrayEqualityCheck" "defaultEqualityCheck"; do
    if ! grep -q "$check" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  Equality check '$check' not documented"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ $check"
    fi
  done

  echo ""
  echo "🔒 Checking for internal/private API leakage..."

  # batch function is marked @private and should not be in public docs
  if grep -q "batch(" "$INSTRUCTIONS_FILE" && ! grep -q "batchTransition" "$INSTRUCTIONS_FILE"; then
    # Allow mentions of batch in context, but not as a recommended API
    if grep -q "use.*batch" "$INSTRUCTIONS_FILE" || grep -q "call.*batch" "$INSTRUCTIONS_FILE"; then
      echo "⚠️  Private 'batch' function appears to be recommended in public API docs"
      ERRORS=$((ERRORS + 1))
    else
      echo "✓ batch function not recommended"
    fi
  else
    echo "✓ batch function not recommended"
  fi

  # Testing utilities should not be featured
  if grep -q "render.*from.*testing-library" "$INSTRUCTIONS_FILE"; then
    echo "⚠️  Testing library utilities should not be in public API docs"
    ERRORS=$((ERRORS + 1))
  else
    echo "✓ Testing utilities not featured"
  fi

  echo ""
  echo "📝 Checking code examples..."

  # Check that examples import from correct packages
  if grep -q "```typescript" "$INSTRUCTIONS_FILE" || grep -q "```tsx" "$INSTRUCTIONS_FILE"; then
    # Check for common mistakes in examples
    if grep -A 5 "fast-text" "$INSTRUCTIONS_FILE" | grep -q "import.*from '@react-facet/core'" | head -1; then
      # Verify dom-fiber is also imported when fast-* components are used
      if ! grep -B 5 "fast-text" "$INSTRUCTIONS_FILE" | grep -q "from '@react-facet/dom-fiber'" | head -1; then
        echo "⚠️  Examples use fast-* components without importing dom-fiber"
        ERRORS=$((ERRORS + 1))
      else
        echo "✓ Examples properly import dom-fiber for fast-* components"
      fi
    else
      echo "✓ Examples structure looks correct"
    fi
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
  echo "Please update $INSTRUCTIONS_FILE to match the current codebase."

  if [ "$MODE" = "public-api" ]; then
    echo ""
    echo "When updating:"
    echo "  1. Verify all public hooks are documented"
    echo "  2. Ensure critical concepts (NO_VALUE, dual deps) are clear"
    echo "  3. Update examples to match current API"
    echo "  4. Remove any internal/private API references"
    echo "  5. Update the 'Last Updated' date"
  fi

  exit 1
fi
