# Documentation

This directory contains the Docusaurus-based documentation website for ore-ui.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Development

### Prerequisites

The documentation site uses React 16 (required by Docusaurus 2.4.3), which is different from the main project's React 18. This is why the documentation is kept as a separate workspace with its own dependencies.

### Getting Started

```console
# From project root
yarn docs:install && yarn docs:start

# Or from docs directory
cd docs && yarn install && yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```console
# From project root
yarn docs:build

# Or from docs directory
cd docs && yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `docs/` directory on the main branch.

### Architecture

- **Framework**: Docusaurus 2.4.3
- **React Version**: 16.9.0 (required by Docusaurus)
- **Deployment**: GitHub Pages
- **Build Output**: `docs/build/`

### Separate Workspace Rationale

The documentation is maintained as a separate workspace (not included in the main yarn workspaces) because:

1. **React Version Conflict**: Main project uses React 18, while Docusaurus requires React 16
2. **Independent Dependencies**: Documentation has different tooling and build requirements
3. **Separate Build Pipeline**: Different CI/CD requirements for documentation vs library packages
4. **Deployment Independence**: Documentation can be deployed separately from library releases
