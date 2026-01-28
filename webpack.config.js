const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'main.js'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer:{
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open: true,
        liveReload: true,
    },  
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            scriptLoading: 'module', // <- ESSENCIAL
            favicon: path.resolve(__dirname, 'src', 'assets', 'logo.svg'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'assets'),
                    to: path.resolve(__dirname, 'dist', 'assets'),
                },                
            ],
        }),
    ],
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/i,
                type: 'javascript/auto', // <- ESSENCIAL

                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceType: 'unambiguous',
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },  
};
