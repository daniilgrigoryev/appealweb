const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/js/init.js',
    output: {path: __dirname + '/dist', filename: 'bundle.js'},
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["transform-object-rest-spread", ["transform-runtime", {
                      "polyfill": false,
                      "regenerator": true
                    }]]
                }
            },


            {
                test: /(\.css$)/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader', "sass-loader"]
            },{
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
                loader: 'url-loader?limit=100000'
            }


            ,{
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader?url=false", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            }
        ]
    }
};

