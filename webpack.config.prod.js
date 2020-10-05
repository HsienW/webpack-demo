const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            {prod: 'test-prod'}
        ]
    },
    plugins: ['prod']
});
