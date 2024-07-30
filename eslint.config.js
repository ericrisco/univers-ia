import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
	{
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			globals: {
				es2021: true,
				node: true
			}
		},
		linterOptions: {
			reportUnusedDisableDirectives: true
		},
		plugins: {
			prettier: eslintPluginPrettier
		},
		rules: {
			...eslintPluginPrettier.configs.recommended.rules
		}
	}
];
