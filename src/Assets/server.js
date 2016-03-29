var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var compiler = webpack(config);
new WebpackDevServer(compiler, {
    contentBase: "./dist",
    hot: true,
    historyApiFallback: true,
    headers: {"Access-Control-Allow-Origin": "*"}
}).listen(3000, 'localhost', function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Running at localhost:3000');
});
