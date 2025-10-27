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

3. **Check for existing public documentation** for missing items:

   For each missing hook/component/API identified in step 2:

   - Search for documentation in `docs/docs/api/` for the missing item
   - Check if comprehensive public-facing documentation exists
   - Verify the documentation includes:
     - Clear API reference with types
     - Multiple usage examples
     - Performance characteristics
     - When to use vs alternatives

   **If documentation is missing or incomplete:**

This is a strict, _fatal_ stop: do not edit or update `.github/copilot-instructions.md` or `.github/copilot-instructions-public-api.md` when any missing API lacks complete public docs. The agent must refuse to proceed and must produce a precise, actionable report and slash-commands for the maintainer to create the missing docs.

Required behavior when docs are missing or incomplete:

1. Immediately STOP any attempt to modify the instruction files. Do not proceed to step 4.

2. Produce a clear report listing every missing or incomplete API. For each item include **all** of the following:


    - Implementation source file path (absolute or repo-relative), e.g. `packages/@react-facet/core/src/components/Unwrap.ts`
    - Test file path(s) if present, e.g. `packages/@react-facet/core/src/components/Unwrap.spec.tsx`
    - Short summary (1-2 sentences) of what the API does, taken from JSDoc or the implementation
    - Exact doc-paths that were searched (so maintainers can see what you looked for), e.g. `docs/docs/api/components/Unwrap.md`

3. For each missing or incomplete API, generate one or more ready-to-run Copilot slash commands that the maintainer can copy & paste to create the missing documentation files. The slash commands must follow this exact format (one command per missing doc):


    ```
    /create-documentation <Title> at <source_path> -> docs/docs/api/<relative_doc_path>.md
    ```

    Examples (exact format):

    ```
    /create-documentation Unwrap component at packages/@react-facet/core/src/components/Unwrap.ts -> docs/docs/api/components/Unwrap.md
    ```

    ```
    /create-documentation Times component at packages/@react-facet/core/src/components/Times.tsx -> docs/docs/api/components/Times.md
    ```

    - The generated doc path must be inside `docs/docs/api/` and mirror the package/component structure when practical.
    - If tests exist, include a suggestion to copy the most representative example(s) from the spec file into the new doc.

4. If docs are present but incomplete, the report must also list the exact missing sections (e.g., "missing function signature", "no usage examples", "no performance notes"), and the slash command should include a short `--template` hint describing required sections (signature, 2 examples, performance notes).

5. After producing the report and slash-commands, explicitly instruct the user to run the provided slash commands (or otherwise add the required docs) and then re-run this fix process. Do not make any edits to the instruction files until the public docs exist and pass verification.

6. Verification checks you must perform when re-checking presence of docs (automated rules the agent must follow):


    - The documentation file exists under `docs/docs/api/` with a markdown header that matches the API name.
    - The doc includes at least one fenced code block that shows the component/function signature or usage (a `tsx` or `typescript` code block).
    - The doc contains at least one `Example` or `Usage` section with concrete examples.
    - The doc includes a short `When to use` or `Notes` section mentioning performance or re-render behavior where applicable.

If any of the verification checks fail, the agent must repeat the STOP+report cycle (do not proceed).

**If documentation exists and is comprehensive:**

- Note the documentation file paths for reference
- Proceed to step 4

4. **Research the codebase** for missing items (only if documentation exists):

   For each missing hook/component/API, read:

   - **The public documentation** (`docs/docs/api/**`) as the primary reference:
     - This is the authoritative source for how the API should be explained
     - Use its examples, explanations, and structure as your guide
     - The custom instructions should align with and reference this documentation
   - **The source file** to understand implementation in detail:
     - Does it use `useFacetUnwrap` internally? (causes re-renders on value changes)
     - Does it maintain facet semantics? (only re-renders on mount/unmount)
     - What are the actual TypeScript types for parameters and return values?
     - Are values kept as facets or unwrapped to regular React state?
   - **JSDoc comments** for intended purpose
   - **Spec files** (`.spec.ts`/`.spec.tsx`) for real usage examples
   - **Related components/hooks** to understand how it fits in the ecosystem
   - **Existing custom instructions** to understand:
     - Established conventions (e.g., when to use `useFacetWrap` vs `useFacetState`)
     - Performance characteristics and re-render behavior
     - How similar components/hooks are documented
     - Common patterns and anti-patterns

5. **Fix the issues** by updating the custom instruction files:

   - `.github/copilot-instructions.md` (full internal guide for contributors/Copilot)
   - `.github/copilot-instructions-public-api.md` (public API reference for users)

6. **For each fix:**

   - **Reference the public documentation** (`docs/docs/api/**`) as your primary source:
     - Use the same examples and explanations where possible
     - Maintain consistency with the public documentation's mental model
     - Add references to the documentation files in your custom instructions
   - **Read the current codebase thoroughly** to verify documentation accuracy:
     - Source file implementation (trace through all function calls)
     - Type signatures (what's a facet vs regular value at each step)
     - JSDoc comments
     - Spec files for real-world usage patterns
   - **Review existing custom instructions** before writing:
     - Check for established conventions about the API you're documenting
     - Review how similar APIs are documented (style, depth, structure)
     - Understand the project's mental model (facet semantics, re-render behavior, etc.)
     - Note any warnings or gotchas about similar patterns
   - **Verify your understanding** by cross-referencing:
     - Does the component/hook unwrap facets or maintain facet semantics?
     - What causes re-renders? (mount/unmount only, or value changes too?)
     - Are there conventions about when to use this vs alternatives?
     - Do your code examples follow established patterns from the instructions?
     - Does your explanation align with the public documentation?
   - Update custom instructions to match code reality and reference documentation
   - Preserve existing writing style and formatting
   - Update the "Last Updated" date to today's date

7. **Documentation Quality Standards:**

   When adding or updating API documentation in custom instructions, ensure you match the existing quality level and align with public documentation:

   **For hooks/functions:**

   - Full function signature with TypeScript types
   - Clear description of purpose and behavior (reference public docs)
   - Multiple code examples showing different use cases (minimum 2-3 examples, ideally from public docs)
   - "When to use" / "When NOT to use" guidance
   - Comparison with similar APIs when applicable
   - Performance implications or warnings (e.g., "causes re-renders")
   - Edge cases and gotchas (e.g., NO_VALUE checks required)
   - Reference to public documentation file when applicable

   **For components:**

   - Component signature with prop types
   - Clear description of purpose and behavior (reference public docs)
   - Code examples showing realistic usage (minimum 2 examples, ideally from public docs)
   - Performance warnings if applicable (e.g., re-render behavior)
   - Comparison with alternative components when applicable
   - Integration examples (how it fits with other patterns)
   - Best practices for usage
   - Reference to public documentation file when applicable

   **Example quality reference:**
   Look at existing entries like `useFacetMap`, `useFacetTransition`, or `Mount` component to see the expected depth and style. Your additions should be comparable in:

   - Length (similar sections should have similar detail)
   - Number of examples (match the pattern - usually 2-4 examples)
   - Level of explanation (match the depth of existing entries)
   - Code quality (complete, runnable examples with proper types)
   - Alignment with public documentation

8. **Verify documentation completeness and accuracy:** Before finishing, validate your additions:

   - **Alignment with public documentation:**

     - Does your custom instruction align with the public documentation's explanation?
     - Are you using examples from or consistent with the public docs?
     - Did you reference the public documentation file path?
     - Are there any contradictions between your instructions and the public docs?

   - **Accuracy checks:**

     - Re-read the source code - does your documentation match the actual implementation?
     - Check type signatures - are facet vs non-facet values correctly represented?
     - Verify re-render behavior - does it unwrap facets or maintain facet semantics?
     - Review code examples - do they follow conventions from the custom instructions?
     - Test mental model - if you were a user reading this, would you understand when/how to use it?

   - **Completeness checks (compare against similar existing entries):**
     - Is your description as clear and detailed?
     - Do you have enough code examples?
     - Did you explain when to use vs when NOT to use?
     - Did you include warnings about performance/behavior?
     - Did you maintain consistent formatting with existing docs?

9. **Verify the fixes** by re-running both check scripts

10. **Show a summary** of what was changed

## Important Notes

- These are **custom instructions for GitHub Copilot**, not user-facing documentation
- The documentation site is in `docs/` - **this is the primary reference source**
- **Documentation-first approach**: If public documentation doesn't exist for an API, STOP and recommend creating documentation first before updating custom instructions
- Code is the source of truth for implementation - use it to verify documentation accuracy
- Both instruction files should document the same APIs, but with different levels of detail:
  - **Full instructions** (`.github/copilot-instructions.md`): Includes internal details, testing, repository structure, development workflows, and contributor guidance
  - **Public API** (`.github/copilot-instructions-public-api.md`): Only user-facing APIs, usage patterns, and best practices - NO testing utilities or internal APIs

**Quality over speed:** Take time to understand the code, review public documentation thoroughly, and write comprehensive custom instructions that align with and reference the public docs. Well-aligned documentation is more valuable than quick additions.

## Workflow Summary

1. Run sync checks → Identify missing items
2. **Check for public docs** → If missing, STOP and report
3. If docs exist → Research codebase + Read public docs
4. Write custom instructions aligned with public docs
5. Verify alignment, accuracy, and completeness
6. Re-run sync checks to confirm
