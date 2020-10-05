const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const config = require('./src/js/config')[isDev ? 'dev' : 'build'];

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './src/js/polyfills.js',
        './src/index.js'
    ],
    output: {
        // path: path.resolve(__dirname, 'dist'), // 必須是絕對路徑
        filename: 'bundle.[hash:6].js',
        publicPath: '/' // 通常是 CDN 位置
    },
    resolve: {
        // alias 是配置用新的別名把原本的 import path 映射成一個新的 import path
        alias: {
            'react': '@test/react-native-to-web' // 這名子是亂取的
        },
        // modules 可以省略長的 import path, 從左到右依次查詢 , 若第一個找不到就會去 node_modules 找
        modules: ['./long-path-test/long-path-test-test', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            // {
            //     test: /\.(css|scss)$/,
            //     exclude: /node_modules/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         'postcss-loader',
            //         'sass-loader'
            //     ]
            // },
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
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, // size 大於 10K 就轉成使用 asset, 小於的話就轉成 64 base
                            // esModule: false,
                            // name: '[name]_[hash:6].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            },
            // {
            //     test: /\.(htm|html)$/i,
            //     use:[ 'html-withimg-loader']
            // }
            // {
            //     test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
            //     use: [
            //         'file-loader',
            //     ]
            // },
        ]
    },
    devServer: {
        port: '8080',
        compress: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            // config: config.template,
            // minify: {
            //     removeAttributeQuotes: false,
            //     collapseWhitespace: false,
            // },
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: 'test-copy/*.js',
                        to: path.resolve(__dirname, 'dist', 'test-copy'),
                        flatten: true,
                    }
                ]
            }
        ),
        new webpack.ProvidePlugin({
            _: ['lodash']
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new OptimizeCssPlugin(), // 壓縮 css 應該配置在 webpack.config.prod.js, dev 不用
        new CleanWebpackPlugin()
    ]
}
