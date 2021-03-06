const path = require('path');
const webpack = require ('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './app/index.html'
        }]),
        new webpack.IgnorePlugin(/jsdom$/)
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            { test: /\.bpmn$/, use: 'text-loader' },

            { test: /\.ts$/, use: 'ts-loader' },

            { test: /\.css$/, use: 'css-loader' }
        ]
    }
    ,
    target: 'electron-main'
};

