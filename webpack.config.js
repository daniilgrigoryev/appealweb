const path = require('path');
const webpack = require('webpack');
const DEV_MODE = process.argv[1].indexOf('webpack-dev-server') !== -1
const publicpath = DEV_MODE ? '/src' : 'js/src';

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
            },{
                test: /\.css$/,
                include: /node_modules/,
                loaders: ['style-loader', 'css-loader']
            },{
                test: /\.(png|svg|gif)$/,
                loader: 'url-loader?limit=1&name=src/images/[name].[ext]'
            },{
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'url-loader?limit=1000000&name=src/fonts/[name].[ext]'
            },{
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader?url=false", // translates CSS into CommonJS
                      {loader: 'sass-loader', 
                        options: {
                          data: "$publicpath : " + publicpath + ";"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({
          DEV_MODE: DEV_MODE,
        })
    ]
};