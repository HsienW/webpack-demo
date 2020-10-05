module.exports = {
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
        ]
    },
    plugins: ['base']
}
