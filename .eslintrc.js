// https://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    rules: {
        'no-console': 2,
        'no-var': 2,
        'prefer-const': 2,
        'no-unused-vars': 1,
        'linebreak-style': [2, 'unix'],
        'object-shorthand': 2,
        'quote-props': [2, 'as-needed'],
        'prefer-template': 1,
        // 只能使用函数表达式
        'func-style': [
            2,
            'expression',
            {
                allowArrowFunctions: true
            }
        ],
        'arrow-parens': [2, 'as-needed'],
        'comma-dangle': 0,
    }
}
