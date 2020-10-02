const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./src/config')[isDev ? 'dev' : 'build'];

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(css|scss)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            // {
            //     test: /\.(sc|c)ss$/,
            //     use: ['style-loader', 'css-loader', {
            //         loader: 'postcss-loader',
            //         options: {
            //             plugins: function () {
            //                 return [
            //                     require('autoprefixer')({
            //                         "overrideBrowserslist": [
            //                             ">0.25%",
            //                             "not dead"
            //                         ]
            //                     })
            //                 ]
            //             }
            //         }
            //     }, 'sass-loader'],
            //     exclude: /node_modules/
            // }
        ]
    },
    devServer: {
        port: '8080',
        quiet: false,
        inline: true,
        overlay: false,
        clientLogLevel: "silent",
        compress: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            config: config.template,
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
            },
        })
    ]
}
