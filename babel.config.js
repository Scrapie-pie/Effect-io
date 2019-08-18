module.exports = {
    presets: ['@vue/app'],
    plugins: ['@babel/plugin-proposal-optional-chaining'],
    env: {
        production: {
            plugins: ['transform-remove-console']
        }
    }
}
