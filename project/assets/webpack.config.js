'use strict';

var webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Clean = require('clean-webpack-plugin');

var PRODUCTION = process.env.NODE_ENV == "production";

module.exports = {
    context: __dirname + '/frontend',
    entry: {
        main: './js/main',
        ratchet: './ratchet/js/ratchet',
        css_site: './sass/site'
    },

    output: {
        path: __dirname + '/dist/app',
        publicPath: '/static/app/',
        filename: 'js/[name].js'
    },

    resolve: {
        extensions: ['', '.js', '.scss'],
        root: __dirname + '/frontend'
    },

    watch: !PRODUCTION,

    watchOptions: {
        aggregateTimeout: 300,
        poll: 500
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: __dirname + '/frontend',
                loader: "babel"
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!postcss-loader?browsers=last 2 version!resolve-url!sass')
            }, {
                test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
                loader: 'url?limit=8192&name=[path][name].[ext]'
            }
        ],

        noParse: [
            /jquery\.js$/
        ]
    },

    sassLoader: {
        sourceMap: true,
        outputStyle: 'expanded',
        sourceComments: true
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "React": "react",
            "window.jQuery": "jquery"
        }),

        new webpack.NoErrorsPlugin(),

        new webpack.optimize.CommonsChunkPlugin({name: 'common', minChunks: 2}),

        new ExtractTextPlugin("css/[name].css", {allChunks: true}),

        new Clean(__dirname + '/dist/app')
    ]
};

if (PRODUCTION) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // don't show unreachable variables etc
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}