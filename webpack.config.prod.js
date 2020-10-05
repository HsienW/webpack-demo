const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            // 當成模擬 prod 需求的設定
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
            }
        ]
    },
    plugins: [
        // 當成模擬 prod 需求的設定
        new CleanWebpackPlugin()
    ]
});
