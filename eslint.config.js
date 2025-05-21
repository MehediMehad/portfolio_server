import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: ['node_modules', 'dist', 'build', '.env'],
        languageOptions: {
            parser: parserTs,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        plugins: {
            '@typescript-eslint': pluginTs,
            prettier: prettier
        },
        rules: {
            
            // TypeScript Specific Rules
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' }
            ],

            // Common Best Practices (for both JS & TS)
            'no-unused-expressions': 'error',
            'prefer-const': 'error',
            'no-console': 'warn',

            // Prettier Formatting
            'prettier/prettier': 'warn'
        }
    }
];
