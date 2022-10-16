module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	root: true,
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [],
	rules: {
		'no-tabs': 'off',
		indent: [1, 'tab'],
		'no-console': 'off',
		semi: ['error', 'always'],
	},
};
