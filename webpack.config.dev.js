const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        }
                    },
                    'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        "overrideBrowserslist": [
                                            ">0.25%",
                                            "not dead"
                                        ]
                                    })
                                ]
                            }
                        }
                    }, 'sass-loader'],
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        // 當成模擬 dev 需求的設定
        new webpack.ProvidePlugin({
            _: ['lodash']
        })
    ]
});
