const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
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
                use: ['style-loader', 'css-loader', {
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
                            limit: 10240, //10K
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
        compress: true
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
        new CleanWebpackPlugin()
    ]
}
