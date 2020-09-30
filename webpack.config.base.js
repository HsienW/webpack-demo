const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./src/config')[isDev ? 'dev' : 'build'];

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
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
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
            },
            config: config.template
        })
    ]
}
