const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: './multiple-page-src/js/index.js',
        login: './multiple-page-src/js/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './multiple-page-src/html/index.html',
            filename: 'index.[hash:6].html', // 打包後的名字
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: './multiple-page-src/html/login.html',
            filename: 'login.[hash:6].html', // 打包後的名字
            chunks: ['login']
        }),
    ]
}
