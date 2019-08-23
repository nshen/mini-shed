module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }], // 除了表达式，其余必须有 return type
        '@typescript-eslint/explicit-member-accessibility': 'off', // public private protected 不用检查
    },
};
