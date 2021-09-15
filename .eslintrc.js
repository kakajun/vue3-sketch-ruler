module.exports = {
  env: {
    browser: true,
    node: true
  },
  plugins: ['prettier'],
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // js/ts
    'vue/no-mutating-props': 'off', // 不能改对象?
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    'no-console': 'off',
    // 'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    camelcase: ['error', { properties: 'never' }],
    //允许 $emit
    'vue/require-explicit-emits': [
      'error',
      {
        allowProps: true
      }
    ],
    // semi: 'always',
    'no-var': 'error',
    'prefer-const': [
      'warn',
      { destructuring: 'all', ignoreReadBeforeAssign: true }
    ],
    'object-shorthand': [
      'error',
      'always',
      { ignoreConstructors: false, avoidQuotes: true }
    ],
    'block-scoped-var': 'error',
    complexity: ['off', 11],
    'no-with': 'error',
    'no-void': 'error',
    // vue
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        parser: 'flow',
        semi: false
      }
    ]
  }
}
