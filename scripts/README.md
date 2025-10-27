# Documentation Sync Check Scripts

This directory contains automated validation scripts to ensure the copilot instruction documents stay synchronized with the codebase.

## Available Scripts

### `check-copilot-instructions-sync.sh`

Validates `.github/copilot-instructions.md` (full contributor guide) against the codebase.

**Usage:**

```bash
./scripts/check-copilot-instructions-sync.sh
```

**What it checks:**

- ✅ All hooks mentioned in instructions exist in code
- ✅ All hooks in code are documented
- ✅ Core components (`Map`, `Mount`, `With`) are documented
- ✅ All packages exist
- ✅ Import paths are correct

**Exit codes:**

- `0` - All checks passed
- `1` - Documentation drift detected

---

### `check-public-api-instructions-sync.sh`

Validates `.github/copilot-instructions-public-api.md` (public API guide) against the codebase.

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
- ✅ No internal/private APIs leaked to public docs
- ✅ Testing utilities not featured (they're internal)
- ✅ Examples use correct imports

**Exit codes:**

- `0` - All checks passed
- `1` - Documentation drift detected

---

## CI/CD Integration

Add both scripts to your continuous integration workflow to catch documentation drift automatically:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  docs-validation:
    name: Validate Documentation
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
# Quick check both docs
./scripts/check-copilot-instructions-sync.sh && \
./scripts/check-public-api-instructions-sync.sh && \
echo "✅ All documentation is in sync!"
```

### In Pull Requests

Configure GitHub Actions to run these checks on every PR to prevent documentation drift from being merged.

---

## Fixing Drift

When a script reports errors, follow these steps:

### 1. Identify the Issue

The script output shows exactly what's missing or incorrect:

```
⚠️  Hook 'useFacetNewFeature' exists in code but not documented in public API docs
```

### 2. Update Documentation

- For **new public APIs**: Add full documentation with examples
- For **removed APIs**: Remove all references
- For **changed APIs**: Update signatures and examples

### 3. Update "Last Updated" Date

In both instruction files, update the maintenance section:

```markdown
> **Last Updated**: DD Month YYYY
```

### 4. Re-run Validation

```bash
./scripts/check-public-api-instructions-sync.sh
```

### 5. Commit Changes

Include documentation updates in the same commit/PR as code changes when possible.

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

If a hook legitimately shouldn't be in public docs (e.g., it's internal), ensure:

1. It's not exported from `packages/@react-facet/core/src/hooks/index.ts`
2. Or, update the script's exclusion logic

### Script Errors

Both scripts use `set -e` to fail fast. If a command fails unexpectedly, check:

- File paths are correct
- grep patterns are accurate
- The repository structure hasn't changed significantly

---

## Related Files

- `.github/copilot-instructions.md` - Full contributor guide (2,184 lines)
- `.github/copilot-instructions-public-api.md` - Public API guide (1,200+ lines)
- `.github/copilot-instructions-comparison.md` - Comparison and usage guide

---

## Philosophy

These scripts embody the principle: **Documentation should be treated as code**. Just like tests verify code correctness, these scripts verify documentation accuracy.

By automating documentation validation, we:

- ✅ Prevent stale documentation
- ✅ Catch missing documentation early
- ✅ Ensure consistency between code and docs
- ✅ Make documentation a first-class citizen in the development process
