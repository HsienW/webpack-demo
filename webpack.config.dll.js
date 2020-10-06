/**
 * 使用 DllPlugin 將不會頻繁更新的 library 抽出並且編譯
 * 再透過一份 manifest.json 來對應相關的 module, 一般用於對第三方套件完全抽離
 * 當這些 library 的版本沒有變化時, 就不需要重新編譯
**/
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        // 以 react & react-dom 當作例子
        react: [
            'react',
            'react-dom'
        ]
    },
    mode: 'production',
    output: {
        filename: '[name].dll.[hash:6].js',
        path: path.resolve(__dirname, 'dist', 'dll'),
        library: '[name]_dll' // 提供給外部使用 (命名需要跟 plugin 設定一致)
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_dll', // name 需要跟 output 設定一致
            path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') //manifest.json 的生成 path
        })
    ]
}
