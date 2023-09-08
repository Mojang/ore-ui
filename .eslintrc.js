/* eslint-env node */

module.exports = {
  extends: [
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    '@react-facet/eslint-config',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['react', 'require-in-package', 'react-hooks', 'prettier'],

  root: true,

  env: {
    es6: true,
    browser: true,
    jest: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    project: './tsconfig.json',
  },

  rules: {
    'import/no-cycle': 'error',
    'no-unreachable': 'error',
    'no-undef': 'error',
    'eqeqeq': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'require-in-package/require-in-package': 2,
  },

  settings: {
    'import/extensions': ['.ts', '.tsx'],
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },

  overrides: [
    {
      files: ['./**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/prefer-interface': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableBoolean: true }],
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variableLike',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'property',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
          },
        ],
      },
    },
  ],
}
