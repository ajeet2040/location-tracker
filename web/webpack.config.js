const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './app.js',
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                hash: true,
                template: './index.html',
                filename: 'index.html',
                inject: 'body'
            }
        )
    ],
    mode: 'development',
    output: {
        clean: true
    },
    devServer: {
        static: './dist',
        open: true
    }
};