/* eslint-env node */

module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    // Disable the require-in-package rule that's problematic for Docusaurus
    'require-in-package/require-in-package': 'off',
  },
  overrides: [
    {
      // For React components in the docs (like homepage components)
      files: ['src/**/*.{js,jsx}'],
      env: {
        browser: true,
        es6: true,
      },
      plugins: ['react', 'prettier'],
      rules: {
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        // Disable problematic import rules for Docusaurus
        'import/no-unresolved': 'off',
        'import/no-named-as-default': 'off',
        'require-in-package/require-in-package': 'off',
      },
    },
  ],
}
