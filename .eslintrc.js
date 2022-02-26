module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		'standard',
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'@typescript-eslint/ban-types': ['error',
			{
				types: {
					String: false,
					Boolean: false,
					Number: false,
					Symbol: false,
					'{}': false,
					Object: false,
					object: false,
					Function: false
				},
				extendDefaults: true
			}
		],
		'@typescript-eslint/no-explicit-any': 'off'
	},
	overrides: [
		{
			files: '*.test.ts',
			rules: {
				'no-unused-expressions': 'off'
			}
		}
	]
}
