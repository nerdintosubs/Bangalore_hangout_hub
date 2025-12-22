module.exports = {
  extends: ['airbnb', 'airbnb/hooks'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // JSX specific rules
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/no-array-index-key': 'warn',
    
    // General rules
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**',
          '**/?(*.)+(spec|test).[jt]s?(x)',
          '**/tests/**',
        ],
      },
    ],
    'max-len': ['warn', { code: 100 }],
    'arrow-body-style': ['warn', 'as-needed'],
    'prefer-arrow-callback': 'warn',
  },
};
