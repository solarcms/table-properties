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
    // devtool: 'source-map',

    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoErrorsPlugin(),

        //Chunk script
        // new Webpack.optimize.CommonsChunkPlugin('dependencies', 'js/dependencies.js', Infinity),

        //Copy assets
        new CopyPlugin([
            // File
            //{from: '../../dist/css/tp.css', to: '../../../../../public/shared/table-properties/css/tp.css', toType: 'file'},
            //{from: '../../dist/js/tp.js', to: '../../../../../public/shared/table-properties/js/tp.js', toType: 'file'},
        ]),
        
        // new Webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('development')
        // }),

        //Chunk css
        new ExtractTextPlugin('css/[name].css', {
            allChunks: true
        }),

        new Webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        }),
        // new Webpack.IgnorePlugin(/(locale)/, /node_modules.+(momentjs)/),

        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new Webpack.BannerPlugin("*************************************\n   Solar Content Management System \n*************************************\n")
    ],

    module: {
        noParse: [/moment.js/],
        loaders: [
            //SCRIPTS
            {
                test: /\.js$/,
                exclude: webpackDirs.excludeDir,
                loader: 'babel',
                query:{
                    presets:['es2015', 'react']
                }
                // loaders: ['babel?compact=false']
            },

            //SCSS
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss-loader!sass')
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
