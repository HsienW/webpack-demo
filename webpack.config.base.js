module.exports = {
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
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
            }
        ]
    }
}
