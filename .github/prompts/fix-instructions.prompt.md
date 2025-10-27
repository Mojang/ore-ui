---
description: Check if the Copilot custom instructions are in sync with the codebase, and fix any desyncs
---

You are helping maintain the **Copilot custom instructions** for this repository (NOT the documentation site in `docs/`).

## Task

Check if the Copilot custom instructions are in sync with the codebase, and if not, fix any desyncs.

## Steps

1. **Run the sync check scripts:**

   - Execute `./scripts/check-copilot-instructions-sync.sh`
   - Execute `./scripts/check-public-api-instructions-sync.sh`

2. **Analyze the output** to identify specific issues:

   - Missing hook/component in custom instructions
   - Hooks/components mentioned in instructions but not in code
   - Package structure mismatches
   - Missing critical concepts (NO_VALUE, dual dependencies, etc.)
   - Internal API leakage in public API instructions

3. **Fix the issues** by updating the custom instruction files:

   - `.github/copilot-instructions.md` (full internal guide for contributors/Copilot)
   - `.github/copilot-instructions-public-api.md` (public API reference for users)

4. **For each fix:**

   - Read the current codebase to understand what exists
   - Update custom instructions to match code reality
   - Preserve existing writing style and formatting
   - Update the "Last Updated" date to today's date

5. **Verify the fixes** by re-running both check scripts

6. **Show a summary** of what was changed

## Important Notes

- These are **custom instructions for GitHub Copilot**, not user-facing documentation
- The documentation site is in `docs/` - do NOT modify those files
- Code is the source of truth - update custom instructions to match code
- Both instruction files should document the same APIs, but with different levels of detail:
  - Full instructions: includes internal details, testing, repository structure
  - Public API: only user-facing APIs, no testing utilities or internal APIs
