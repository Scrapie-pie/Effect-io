module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/dist/'
        : '/',
    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                data: '@import "@/scss/settings.scss";'
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .use('file-loader')
            .loader('svg-sprite-loader')
            .options({
                extract: true,
                spriteFilename: 'icons-sprite.svg',
                publicPath: '/'
            })

        config.plugin('svg-sprite-loader-plugin').use(require('svg-sprite-loader/plugin'), [
            {
                plainSprite: true,

            }
        ])
    }
}

/* module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/scss/settings.scss";'
            }
        }
    },
    lintOnSave: false,
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /icons\/(-?\w\/?){0,}\.svg(\?.*)?$/,
                    use: [{
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'icons-sprite.svg',
                            publicPath:'/'
                        }
                    },
                        //'svgo-loader'
                    ]
                },
            ]
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .use('file-loader')
            .loader('svg-sprite-loader')
    }
} */