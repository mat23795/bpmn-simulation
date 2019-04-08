const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './app/index.html'
        }])
    ],
    module: {
        rules: [
            { test: /\.bpmn$/, use: 'text-loader' },
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    }
};

