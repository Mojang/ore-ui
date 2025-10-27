# Copilot Custom Instructions Sync Check Scripts

This directory contains automated validation scripts to ensure the Copilot custom instruction files stay synchronized with the codebase.

## Quick Start: VS Code Copilot Slash Command

The easiest way to check and fix the custom instructions is using the Copilot slash command:

```
/fix-instructions
```

This will:

1. Run both sync check scripts
2. Identify all desyncs between code and custom instructions
3. Automatically fix the issues in both instruction files
4. Verify the fixes by re-running the checks
5. Show you a summary of changes

The command is configured in `.github/prompts/fix-instructions.prompt.md`.

## Available Scripts

### `check-copilot-instructions-sync.sh`

Validates `.github/copilot-instructions.md` (full internal guide) against the codebase.

**Usage:**

```bash
./scripts/check-copilot-instructions-sync.sh
```

**What it checks:**

- ✅ All hooks mentioned in custom instructions exist in code
- ✅ All hooks in code are documented in custom instructions
- ✅ Core components (`Map`, `Mount`, `With`) are documented
- ✅ All packages exist
- ✅ Import paths are correct

**Exit codes:**

- `0` - All checks passed
- `1` - Custom instructions drift detected

---

### `check-public-api-instructions-sync.sh`

Validates `.github/copilot-instructions-public-api.md` (public API reference) against the codebase.

**Usage:**

```bash
./scripts/check-public-api-instructions-sync.sh
```

**What it checks:**

- ✅ All documented hooks exist in the codebase
- ✅ All public hooks from `core/src/hooks/index.ts` are documented
- ✅ Core components are properly documented
- ✅ Package imports are correct
- ✅ Critical concepts explained (NO_VALUE, dual dependencies)
- ✅ Equality checks are documented
- ✅ No internal/private APIs leaked to public instructions
- ✅ Testing utilities not featured (they're internal)
- ✅ Examples use correct imports

**Exit codes:**

- `0` - All checks passed
- `1` - Custom instructions drift detected

Note about code fence checks
---------------------------
When these scripts search for Markdown code fences like ```typescript the shell can accidentally interpret backticks (``) as command substitution if the pattern is double-quoted. The scripts therefore use single-quoted grep patterns (for example: grep -q '```typescript') to avoid this class of errors. If you modify the scripts, keep that in mind to prevent runtime failures.

---

## CI/CD Integration

Add both scripts to your continuous integration workflow to catch custom instructions drift automatically:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  instructions-validation:
    name: Validate Copilot Custom Instructions
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Full Instructions Sync
        run: ./scripts/check-copilot-instructions-sync.sh

      - name: Check Public API Instructions Sync
        run: ./scripts/check-public-api-instructions-sync.sh
```

---

## When to Run

### During Development

Run these scripts whenever you:

- Add/remove/modify public APIs (hooks, components, utilities)
- Update package structure
- Change import paths
- Add new best practices or patterns

### Before Release

Always run both scripts as part of your release checklist:

```bash
# Quick check both instruction files
./scripts/check-copilot-instructions-sync.sh && \
./scripts/check-public-api-instructions-sync.sh && \
echo "✅ All custom instructions are in sync!"
```

### In Pull Requests

Configure GitHub Actions to run these checks on every PR to prevent custom instructions drift from being merged.

---

## Fixing Drift

When a script reports errors, you can either use the `/fix-instructions` slash command or follow these manual steps:

### Using Slash Command (Recommended)

```
/fix-instructions
```

Copilot will automatically fix all desyncs and update both instruction files.

### Manual Fix Steps

#### 1. Identify the Issue

The script output shows exactly what's missing or incorrect:

```
⚠️  Hook 'useFacetNewFeature' exists in code but not documented in public API docs
```

#### 2. Update Custom Instructions

- For **new public APIs**: Add full documentation with examples
- For **removed APIs**: Remove all references
- For **changed APIs**: Update signatures and examples

#### 3. Update "Last Updated" Date

In both instruction files, update the maintenance section:

```markdown
> **Last Updated**: DD Month YYYY
```

#### 4. Re-run Validation

```bash
./scripts/check-public-api-instructions-sync.sh
```

#### 5. Commit Changes

Include custom instructions updates in the same commit/PR as code changes when possible.

---

## Maintenance

### Script Maintenance

When the project structure changes:

1. **New package added**: Update package check lists in both scripts
2. **New export added**: Ensure it's checked against documentation
3. **Critical concept added**: Add to the "critical concepts" check

### Keeping Scripts in Sync

The public API script is intentionally stricter than the full instructions script:

- **Full script**: Checks everything (including internal details)
- **Public API script**: Only checks user-facing APIs + enforces no private API leakage

When updating one script, consider if the other needs similar changes.

---

## Troubleshooting

### Script Won't Execute

```bash
chmod +x ./scripts/check-copilot-instructions-sync.sh
chmod +x ./scripts/check-public-api-instructions-sync.sh
```

### False Positives

If a hook legitimately shouldn't be in public instructions (e.g., it's internal), ensure:

1. It's not exported from `packages/@react-facet/core/src/hooks/index.ts`
2. Or, update the script's exclusion logic

### Script Errors

Both scripts use `set -e` to fail fast. If a command fails unexpectedly, check:

- File paths are correct
- grep patterns are accurate
- The repository structure hasn't changed significantly

---

## Related Files

- `.github/copilot-instructions.md` - Full internal guide for contributors/Copilot
- `.github/copilot-instructions-public-api.md` - Public API reference for users
- `.github/prompts/fix-instructions.prompt.md` - Slash command configuration
- `docs/` - User-facing documentation site (separate from custom instructions)

---

## Philosophy

These scripts embody the principle: **Custom instructions should be treated as code**. Just like tests verify code correctness, these scripts verify custom instructions accuracy.

By automating custom instructions validation, we:

- ✅ Prevent stale custom instructions
- ✅ Catch missing documentation early
- ✅ Ensure consistency between code and custom instructions
- ✅ Make custom instructions a first-class citizen in the development process
