/* eslint-env node */

module.exports = {
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useFacetEffect|useFacetMap|useFacetMemo|useFacetCallback)',
      },
    ],
  },
}
