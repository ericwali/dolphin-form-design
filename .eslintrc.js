const { defineConfig } = require('eslint-define-config');
module.exports =  defineConfig({
  root: true,
  env: {
    node: true,
  },
  parserOptions:{
    ecmaVersion: 2020
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/multi-word-component': 'off',
    'multiline-ternary': 'off'
  }
})
