const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './*.html'
        }])
    ]
};