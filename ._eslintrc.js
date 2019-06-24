module.exports = {
	root: true,
	parserOptions: {
		sourceType: 'module',
		parser: 'babel-eslint'
	},
	env: {
		browser: true
	},
	extends: [
		'prettier',
		'prettier/standard',
		//'plugin:vue/essential'
		'plugin:vue/recommended'
	],
	plugins: ['vue', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'generator-star-spacing': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
	}
}
