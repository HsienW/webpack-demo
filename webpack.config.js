const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const apiMocker = require('mocker-api');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

// BundleAnalyzerPlugin 可以查看是哪些 plugin 的 size 較大
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// HardSourceWebpackPlugin 為 module 提供中間佔存, 存放路徑是: node_modules/.cache/hard-source
// 消果再非初次 build 時可以看出, 大幅壓縮
// 若是與 DllPlugin 方法一起使用, 當 run dev 時 src 有 update, 會產生 error
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');


// SpeedMeasurePlugin 可以測量各個 plugin 和 loader 所花費的時間
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");


// HappyPack 可以把 task 分解給多個子線程去並發的執行, 子線程處理完後再把結果發送給主線程
// 若 build 的時候速度緩慢很有用
// 若 project 不是很複雜時, 不需要配置 HappyPack,
// 因為進程的分配和管理也需要時間, 並不能有效提升構建速度, 甚至會變慢。
// const HappyPack = require('happypack');


// thread-loader
// 放置在其它 loader 之前, 那麼放置在這個 loader 之後的 loader 就會在一個單獨的 worker loop 中運行
// 放入 thread-loader 的 loader 受到以下的限制:
// 1. 不能產生新的文件
// 2. 不能使用定制的 loaderAPI
// 3. 無法獲取 webpack 的選項設置


const isDev = process.env.NODE_ENV === 'development';
const config = require('./src/js/config')[isDev ? 'dev' : 'build'];

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    devtool: 'cheap-module-eval-source-map',
    entry: [
        // './src/js/polyfills.js',
        './src/index.js'
    ],
    output: {
        // path: path.resolve(__dirname, 'dist'), // 必須是絕對路徑
        filename: 'bundle.[hash:6].js',
        publicPath: '/' // 通常是 CDN 位置
    },
    optimization: {
        // 套件 & common 的 code 拆分成 chunk
        concatenateModules: false,
        splitChunks: {
            maxInitialRequests: 6,
            // cacheGroups 用途是定義 chunks 所屬的 cache 組
            cacheGroups: {
                // 拆分第三方套件
                vendor: {
                    priority: 1, // 設定優先級, 首先抽出第三方套件
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    enforce: true,
                    minSize: 0,
                    minChunks: 1 // 拆分條件是, 在 src 中最少 import 了1次的都拆
                },
                // 拆分第三方套件 moment
                moment: {
                    name: 'moment', // 單獨把 moment 拆包出來
                    priority: 2, // 權重要大於 vendor
                    test: (module) => {
                        return /moment/.test(module.context);
                    },
                    chunks: 'initial',
                    minSize: 10, // size 超過 10 byte 的都算
                    minChunks: 1 // 拆分條件是, 在 src 中最少 import 了1次的都拆
                },
                // 拆分第三方套件 uuid
                uuid: {
                    name: 'uuid', // 單獨把 uuid 拆包出來
                    priority: 2, // 權重要大於 vendor
                    test: (module) => {
                        return /uuid/.test(module.context);
                    },
                    chunks: 'initial',
                    minSize: 10, // size 超過 10 byte 的都算
                    minChunks: 1 // 拆分條件是, 在 src 中最少 import 了1次的都拆
                },
                // 拆分 common code 成暫存, 避免重複打包
                common: {
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, // size 超過 100 byte 的都算
                    minChunks: 1 // 拆分條件是, 在 src 中最少 import 了3次的都拆
                }
            }
        },
        // runtimeChunk: 'multiple'
        // runtimeChunk 的作用是將包含 chunk 映射關係的列表從 main.js 中抽離出來
        runtimeChunk: {
            name: 'manifest'
        }
    },
    resolve: {
        // extensions 可以用來設定 mobile 端要轉 web 的 file, 先找 .web.js, 如果沒有再找.js
        extensions: [
            'web.js',
            '.js'
        ],
        // alias 是設定用新的別名把原本的 import path 映射成一個新的 import path
        alias: {
            // 'react': '@test/react-native-to-web' // 這名子是亂取的
        },
        // modules 可以省略長的 import path, 從左到右依次查詢 , 若第一個找不到就會去 node_modules 找
        modules: ['./long-path-test/long-path-test-test', 'node_modules'],
        // mainFields 可以修改 default 設定, default 是 ['browser', 'main'],
        // 先找對應 package.json中的 browser 字段, 如果沒有找 main
        mainFields: ['style', 'main']
    },
    module: {
        // noParse 用來標識這個 module, 不進行轉化和解析, 讓 Webpack 直接引入使用
        noParse: /jquery|lodash/,
        // loader 的使用 exclude 優先級高於 include, 在include 和 exclude 中使用絕對路徑 array,
        // 盡量避免 exclude, 因為會涵蓋到多餘的, 所以更傾向於使用include
        rules: [
            {
                test: /\.(jsx|js)?$/,
                include: [path.resolve(__dirname, 'src')],
                // exclude: /node_modules/,

                // 跟 plugins 中的設定對應
                // use: 'happypack/loader?id=js',
                use: ['cache-loader', 'babel-loader']
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
                    'cache-loader',
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
                include: [path.resolve(__dirname, 'src')],
                // exclude: /node_modules/
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
                include: [path.resolve(__dirname, 'src')],
                // exclude: /node_modules/
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
        hot: true,
        // this use mocker-api lib fake call api
        before(app) {
            apiMocker(app, path.resolve('./src/mock-data/mocker-api.js'))
        }
    },
    plugins: [
        // new HappyPack({
        //     // 跟設定中的 module.rules 的 id 對應(id=js)
        //     id: 'js',
        //     // 跟之前設定的 module.rules loader 一樣
        //     /** 若跟 cache-loader 同時使用請先刪除 node_modules\.cache\cache-loader 舊有的 cache **/
        //     use: ['cache-loader', 'babel-loader'] // 必須是 array
        // }),
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
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new webpack.ProvidePlugin({
            _: ['lodash']
        }),
        // manifest.json 用於讓 DLLReferencePlugin 映射到相關 dependency
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new OptimizeCssPlugin(), // 壓縮 css 應該設定在 webpack.config.prod.js, dev 不用
        // new HardSourceWebpackPlugin(),
        new MomentLocalesPlugin(),
        new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin({
            // 設定每次 build 都不清除 dll folder, 因為是抽出不常更新的第三方套件
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']
        })
    ]
})
