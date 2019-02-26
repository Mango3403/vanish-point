const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

new UglifyJSPlugin();

module.exports = {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
        draw: './src/js/draw.js',
        control: './src/js/control.js',
        index: './src/js/index.js',
        login: './src/js/login.js',
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            // {
            // 	test: /\.js/,
            // 	use: {
            // 		loader: 'babel-loader',
            // 		query: {
            // 			presets: ["env", "stage-0"]
            // 		}
            // 	},
            // },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: 'url-loader',
                include: path.join(__dirname, './src'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['main', 'draw', 'control', 'index'],
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['login'],
            template: './src/login.html',
        })
    ]
};