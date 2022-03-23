# Benchmarking

Examples to compare the React's default reconciliation vs the "observable-based" solution of Facets.

Usually examples will come in pairs, with both implementations. Example: `listMemoFacet` and `listMemoState`.

## Running

Each file in the `src` folder becomes an HTML entry point.

To have fair results, we recommend running a build:

```
yarn build
```

Then start the HTTP server:

```
yarn serve
```

And open the examples in the target platform. Ex: http://localhost:8080/listMemoFacet.html

## Comparing

There is a compare script that runs the comparison automatically using Chrome. Simply pass the two examples to compare and a target relative performance:

```
yarn compare progressBarFacet progressBarState 74
```

Moe was here ^^
