const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    module: {
        rules: [
            {dev: 'test-dev'}
        ]
    },
    plugins: ['dev']
});
