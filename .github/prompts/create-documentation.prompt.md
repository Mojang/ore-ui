---
description: Create comprehensive public-facing documentation for React Facet APIs (hooks, components, utilities)
---

You are helping create **public-facing documentation** for React Facet APIs in the `docs/` directory.

## Task

Create thorough, accurate documentation for a specific hook, component, or utility that currently lacks documentation or has incomplete documentation.

## Process Overview

This is an **iterative process** - expect multiple rounds of review and refinement. The goal is production-quality documentation that serves as the authoritative reference for users.

## Steps

### 1. Identify the Documentation Target

The user will specify which API to document (e.g., `With` component, `useFacetMap` hook).

**Initial questions to ask:**

- What is the exact name of the hook/component/utility?
- Is there existing documentation that needs updating, or is this new?
- Are there related APIs that should be documented at the same time?

### 2. Assess Existing Documentation Structure

Before writing anything, understand where this documentation fits:

**Explore the documentation structure:**

- Read `docs/docs/api/` to see existing API documentation
- Identify patterns in how hooks vs components are documented
- Note the file naming conventions (kebab-case, organization by type)
- Check `docs/sidebars.js` to understand navigation structure
- Look for related documentation that might need cross-references

**Key questions to answer:**

- Where should this documentation file live? (`docs/docs/api/hooks/`, `docs/docs/api/components/`, etc.)
- What filename follows the existing convention?
- How are similar APIs organized and structured?
- What cross-references need to be added (to/from other docs)?
- Does `sidebars.js` need updating to include this page?

Important: follow existing grouping patterns

- Many component docs in this repo are collected into shared category pages (for example `mount-components.md` contains `Mount`, `Map`, and `With`) rather than one file per component. Before creating a new `components/` subfolder or a new standalone file, check whether there is an existing category page that the API should be appended to. Only create a new standalone file when the repository already uses individual files for that category (for example a `hooks/` directory with separate files).
- When appending to an existing category page, follow the same ordering, heading styles, and example formatting found on that page.

**Report your findings:**

- Proposed file path
- Related documentation files that may need updates
- Sidebar configuration changes needed

Also include:

- Whether the API should be appended to an existing category page or created as a new file (and why).
- Exact target file (e.g., `docs/docs/api/mount-components.md` to append to, or `docs/docs/api/components/unwrap.md` to create). Provide rationale matching repository patterns.

### 3. Deep Research of the API

Gain a thorough understanding through multiple sources:

#### Source Code Investigation

- **Read the implementation file:**

  - Understand every line - what does it actually do?
  - Trace through all function calls and dependencies
  - Identify type signatures (what's a facet vs regular value?)
  - Note any internal implementation details that affect behavior
  - Does it use `useFacetUnwrap` (causes re-renders) or maintain facet semantics?
  - What are the performance characteristics?

- **Read JSDoc comments:**

  - Original intent and purpose
  - Parameter descriptions
  - Return value documentation

- **Read spec/test files:**
  - How is the API actually used?
  - What edge cases are tested?
  - What scenarios are considered important?
  - Extract realistic usage examples

#### Related Code

- **Find related APIs:**

  - Similar hooks/components that solve related problems
  - APIs that are commonly used together
  - Alternatives that users might consider

- **Search for usage in examples:**
  - Check `examples/` directory
  - Look for usage patterns in the codebase
  - Note common combinations and patterns

#### Custom Instructions

- **Review `.github/copilot-instructions.md`:**
  - Check for established conventions about this API
  - Look for warnings, gotchas, or best practices
  - Understand how it fits into the mental model
  - Note any critical rules about usage

**Report your understanding:**

- What does this API do? (in your own words)
- How does it work internally?
- What are the performance characteristics?
- What are common use cases?
- What are common pitfalls?
- How does it compare to alternatives?

### 4. Study Documentation Standards

Before writing, thoroughly review existing documentation to match style and quality:

**Read 3-5 similar API documentation files:**

- How are they structured? (sections, ordering)
- What's the typical length and depth?
- How many code examples do they include?
- How do they explain "when to use" vs "when NOT to use"?
- How do they handle performance warnings?
- How do they show type signatures?
- What's the tone and voice?

**Identify the documentation template/pattern:**

- Standard sections (Overview, API Reference, Examples, etc.)
- Code example format (live demos, syntax highlighting, etc.)
- Callout patterns (warnings, notes, tips)
- Cross-reference style

**Report the documentation pattern:**

- Required sections
- Optional sections
- Example structure
- Callout patterns used

### 5. Draft the Documentation

Write comprehensive documentation following the identified patterns:

#### Required Elements

**Frontmatter:**

```markdown
---
title: [API Name]
sidebar_label: [Short Label]
---
```

**Overview Section:**

- Clear, concise description of what it does
- Why it exists / what problem it solves
- When to use it vs alternatives

**API Reference:**

- Full type signature
- Parameter descriptions with types
- Return value description with type
- Default values
- Optional vs required parameters

**Usage Examples:**

- **Minimum 3-4 examples** showing different scenarios:
  - Basic usage (simplest case)
  - Common real-world usage
  - Advanced usage or edge cases
  - Usage with related APIs
- Each example should:
  - Be complete and runnable
  - Include TypeScript types
  - Have explanatory comments
  - Show realistic variable names
  - Follow conventions from custom instructions

**Performance Considerations:**

- Does it cause re-renders? When?
- Does it create new facet references? When?
- Are there performance gotchas?
- Comparison with alternatives' performance

**When to Use / When NOT to Use:**

- Clear guidance on appropriate use cases
- Explicit anti-patterns or cases to avoid
- Alternatives for cases where this isn't suitable

**Related APIs:**

- Links to related hooks/components
- Common combinations
- Alternatives to consider

**Notes/Warnings:**

- Edge cases
- Common mistakes
- Critical behavior (like NO_VALUE handling)

#### Quality Standards

- **Accuracy**: Every detail must match the actual implementation
- **Completeness**: Cover all parameters, edge cases, and scenarios
- **Clarity**: Explain complex concepts simply
- **Examples**: Show, don't just tell - provide working code
- **Consistency**: Match existing documentation style exactly

**Present your draft and ask:**

- Is the explanation clear and accurate?
- Are the examples realistic and helpful?
- Did I miss any important use cases or warnings?
- Does this match the existing documentation style?

### 6. Handle Cross-References

Identify and update related documentation:

**Find documentation that should reference this new page:**

- Related APIs that might mention this as an alternative
- Tutorial pages that could benefit from this API
- Parent category pages that list APIs

**Add cross-references:**

- Link to this new documentation from related pages
- Add to any API listing pages
- Update comparison tables if they exist

**Update sidebars.js:**

- Add entry in the appropriate section
- Ensure proper ordering (alphabetical or logical grouping)

**Report cross-reference updates:**

- List of files that need new links
- Sidebar configuration changes
- Any navigation structure improvements

### 7. Iterative Refinement

This is a collaborative process. After presenting your draft:

**Expect feedback on:**

- Technical accuracy ("Actually, it works like this...")
- Example quality ("This example doesn't show the real use case")
- Missing edge cases ("What about when the value is null?")
- Style/tone mismatches ("This doesn't match our voice")
- Structure improvements ("This section should come first")

**For each round of feedback:**

- Acknowledge the issue clearly
- Explain how you'll address it
- Make the changes
- Verify the changes against source code
- Present the updated version

**Continue iterating until:**

- Technical accuracy is verified
- All use cases are covered
- Examples are realistic and helpful
- Style matches existing documentation
- User confirms it's ready

### 8. Final Verification

Before considering the documentation complete:

**Self-review checklist:**

- [ ] Read the source code again - does the documentation match?
- [ ] Run through each code example mentally - do they work?
- [ ] Check all type signatures - are they accurate?
- [ ] Verify performance claims - did you trace through the implementation?
- [ ] Review NO_VALUE handling - is it documented where applicable?
- [ ] Check facet vs non-facet values - is it clear throughout?
- [ ] Compare to similar documentation - is quality equivalent?
- [ ] Test all internal links - do they work?
- [ ] Review cross-references - are they bidirectional where appropriate?

**Ask for final review:**

- Read through the complete documentation
- Verify against the actual implementation one more time
- Request final approval from the user

### 9. Summary

Provide a concise summary:

- **File created/updated:** Path to documentation file
- **Cross-references added:** List of files with new links
- **Sidebar updates:** Changes to navigation
- **Key decisions:** Any important choices made about structure or content
- **Follow-up recommendations:** Related APIs that might need documentation

## Important Guidelines

### Accuracy is Paramount

- **Never guess** - if you're unsure, trace through the source code again
- **Verify types** - facet vs non-facet values must be correct
- **Test understanding** - explain the behavior in your own words and verify
- **Ask questions** - if something is unclear, ask rather than assume

### Write for Users, Not Implementers

- Focus on "how to use" not "how it works internally"
- Include internal details only when they affect behavior
- Explain concepts in terms users understand
- Avoid implementation jargon unless necessary

### Examples Are Critical

- Every example must be complete and runnable
- Use realistic variable names and scenarios
- Show common patterns, not artificial demos
- Include TypeScript types in examples
- Follow conventions from custom instructions (e.g., facet naming, when to use `useFacetWrap` vs `useFacetState`)

### Maintain Consistency

- Match existing documentation structure exactly
- Use the same terminology as other docs
- Follow the same code style in examples
- Use the same callout patterns (warnings, notes, tips)

### Performance Documentation

For React Facet, performance is a key concern. Always document:

- Re-render behavior (when does the component/hook cause re-renders?)
- Facet reference stability (when are new facet references created?)
- Comparison with alternatives
- Performance gotchas or optimization tips

## Docusaurus-Specific Guidelines

This project uses Docusaurus. Be aware of:

### Frontmatter

```markdown
---
title: API Name
sidebar_label: Short Label
description: Brief description for SEO
---
```

### Code Blocks

`````markdown
````typescript
// Code here
\```
````
`````

````

### Callouts

```markdown
:::note
Standard information
:::

:::tip
Helpful advice
:::

:::warning
Important warnings
:::

:::danger
Critical warnings
:::
```

### Internal Links

```markdown
[Link Text](./other-page.md)
[Link Text](../category/page.md)
```

## Iteration Protocol

This is a collaborative, iterative process:

1. **Present research findings** → Get confirmation on understanding
2. **Present documentation structure** → Get approval on organization
3. **Present draft documentation** → Get detailed feedback
4. **Refine based on feedback** → Present updated version
5. **Repeat steps 3-4** until approved
6. **Present cross-reference plan** → Get approval
7. **Make all updates** → Get final verification

**At each step:**

- Explain your reasoning
- Ask specific questions when uncertain
- Acknowledge feedback explicitly
- Show how you addressed each point
- Request confirmation before proceeding

## Success Criteria

Documentation is complete when:

- ✅ User confirms technical accuracy
- ✅ All common use cases are covered with examples
- ✅ Performance characteristics are clearly documented
- ✅ Edge cases and gotchas are explained
- ✅ Style and structure match existing documentation
- ✅ Cross-references are complete and bidirectional
- ✅ Sidebar navigation is updated
- ✅ Self-review checklist is complete
- ✅ User gives final approval

## Remember

- **Quality over speed** - take the time to understand deeply
- **Iterate, don't perfect** - expect multiple rounds of refinement
- **Ask questions** - better to clarify than to guess
- **Verify everything** - trace through code, don't assume
- **Stay aligned** - maintain consistency with existing documentation

Good documentation is the foundation for good custom instructions. Take the time to get this right.
````
