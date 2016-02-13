/**
 * Created by n0m4dz on 11/27/15.
 */
var webpack = require('webpack');
var WebpackStrip = require('strip-loader');
var devConfig = require('./webpack.config');

var stripLoader = {
    test : [/\.js$/, /\.es6$/],
    exclude: devConfig.conf.excludeDir,
    loader: WebpackStrip.loader('console.log')
};

devConfig.module.loaders.push(stripLoader);

module.exports = devConfig;