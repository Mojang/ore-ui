# Copilot Instructions Comparison

## Overview

This repository now has two versions of copilot instructions:

1. **`copilot-instructions.md`** - Full internal guide for contributors
2. **`copilot-instructions-public-api.md`** - Streamlined public API guide for users

## Key Differences

### What Was Removed from Public API Version

#### 1. **Repository Structure & Development Workflow**
- Monorepo structure details
- File conventions and locations
- Testing infrastructure (`*.spec.ts` files, testing utilities)
- Build scripts and development commands
- Documentation site setup

**Reasoning**: External users don't need to know the internal repository organization or contribute to the codebase. They only need to use the published npm packages.

#### 2. **Documentation-Specific Content**
- Docusaurus setup details
- Documentation code example patterns
- `// @esModuleInterop` and `// ---cut---` directives for docs
- Documentation maintenance guidelines

**Reasoning**: These are implementation details for maintaining the documentation site, not relevant for API usage.

#### 3. **Testing Patterns**
- Test file structure and conventions
- Testing utilities (`@react-facet/dom-fiber-testing-library`)
- Common test patterns and examples
- `render()` and `act()` from testing library

**Reasoning**: While testing is important, the public API guide focuses on using the library in applications. Testing specifics can be found in the main documentation.

#### 4. **Internal Implementation Details**
- How the custom renderer works internally
- `batch` function (marked as `@private`)
- Detailed explanation of reconciliation bypass mechanism
- Internal scheduler implementation

**Reasoning**: Users don't need to understand implementation internals to use the API effectively.

#### 5. **Contributor Guidelines**
- Release checklist
- Documentation maintenance ownership
- Integration with development workflow
- Maintaining instructions document
- "Last Updated" tracking

**Reasoning**: These are for maintainers, not API consumers.

#### 6. **VS Code/Copilot-Specific Meta Instructions**
- Instructions about when to use tools
- How Copilot should behave
- Tool usage guidelines
- Context about being an AI assistant

**Reasoning**: Public API guide is for all AI contexts/developers, not specifically GitHub Copilot in VS Code.

### What Was Kept in Public API Version

#### Core API Elements
- ✅ All public hooks with full signatures
- ✅ Complete component API (`Mount`, `Map`, `With`)
- ✅ All `fast-*` components
- ✅ Equality check functions
- ✅ Type definitions and interfaces
- ✅ Special values (`NO_VALUE`)

#### Critical Concepts
- ✅ The 3 critical errors to avoid
- ✅ What is a Facet (core concept)
- ✅ Observable-based state management philosophy
- ✅ Performance characteristics
- ✅ When to use each API

#### Usage Patterns
- ✅ Common patterns for state creation, derivation, rendering
- ✅ Side effects and callbacks
- ✅ Conditional rendering patterns
- ✅ List rendering patterns

#### Best Practices
- ✅ Naming conventions
- ✅ Performance guidelines
- ✅ Common pitfalls
- ✅ When to use which hook/component
- ✅ NO_VALUE handling patterns

#### Complete Examples
- ✅ Counter with derived state
- ✅ Form with validation
- ✅ List with conditional rendering
- ✅ All three maintain full working code

#### Quick Reference
- ✅ Most common hooks summary
- ✅ Core components summary
- ✅ Equality checks import reference
- ✅ Decision trees for choosing APIs

## Usage Recommendations

### For Library Maintainers
Use **`copilot-instructions.md`** as your Copilot instructions. It includes:
- Full repository context
- Testing and development patterns
- Documentation maintenance
- Contributor workflows

### For Library Users / External AI Contexts
Use **`copilot-instructions-public-api.md`** as your guide. It provides:
- Clean public API reference
- Usage patterns and best practices
- Complete examples
- Decision-making frameworks

### For Documentation
The public API version can serve as a foundation for:
- API reference documentation
- Quick start guides
- Best practices sections
- Integration with other AI coding assistants

## File Sizes

- **Full version**: ~2,184 lines (comprehensive guide)
- **Public API version**: ~1,067 lines (50% smaller, focused on API usage)

The public API version is more digestible while maintaining all essential information for effective library usage.

## Maintenance

When updating the library:

1. **Update `copilot-instructions.md`** with any changes (API, patterns, repository structure)
2. **Extract relevant public API changes** to `copilot-instructions-public-api.md`
3. **Keep implementation details** in the full version only
4. **Keep usage patterns and best practices** in both versions

The public API version should be a pure subset focused on "how to use" rather than "how it works" or "how to contribute".
