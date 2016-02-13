/**
 * Created by n0m4dz on 10/20/15.
 */

var Path = require('path');
var Webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

var webpackDirs = {
    contextDir: Path.resolve(__dirname, './src/scripts'),
    sassDir: Path.resolve(__dirname, './src/scss'),
    pathDir: Path.join(Path.resolve(__dirname, './dist/')),
    nodeDir: Path.join(Path.resolve(__dirname, './node_modules')),
    logsDir: Path.join(Path.resolve(__dirname, './logs')),
    excludeDir: [/(node_modules|tests|logs)/]
};

module.exports = {
    conf: {
        excludeDir: webpackDirs.excludeDir
    },

    context: webpackDirs.contextDir,

    entry: {
        dependencies: ['./vendor'],
        tp: ['./app']
    },

    output: {
        path: webpackDirs.pathDir,
        filename: 'js/[name].js',
        publicPath: '../'
    },


    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoErrorsPlugin(),

        //Chunk script
        new Webpack.optimize.CommonsChunkPlugin('dependencies', 'js/dependencies.js', Infinity),

        //Chunk css
        new ExtractTextPlugin('css/[name].css', {
            allChunks: true
        }),

        //Aliasing library
        new Webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),

        //Copy assets
        new CopyPlugin([
            // File
            //{from: '../../dist/css/tp.css', to: '../../../../../public/shared/table-properties/css/tp.css', toType: 'file'},
            //{from: '../../dist/js/tp.js', to: '../../../../../public/shared/table-properties/js/tp.js', toType: 'file'},
        ]),

        

        new Webpack.BannerPlugin("*************************************\n   Solar Content Management System \n*************************************\n")
    ],

    module: {
        loaders: [
            //SCRIPTS
            {
                test: /\.js$/,
                exclude: webpackDirs.excludeDir,
                loaders: ['babel']
            },

            //SCSS
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass')
            },

            // IMAGES
            {
                test: /\.png($|\?)|\.jpg($|\?)|\.gif($|\?)|\.bmp($|\?)|\.svg($|\?)/,
                loader: 'url-loader?limit=10000&name=images/[name].[ext]'
            },

            // FONTS
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            },
        ]
    },
    sassLoader: {
        includePaths: webpackDirs.sassDir
    },

    resolve: {
        root: [webpackDirs.pathDir],
        alias: {},
        extensions: ['', '.js', '.scss', '.css', '.html']
    }
};
