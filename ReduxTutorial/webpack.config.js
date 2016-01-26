var webpack = require('webpack');
module.exports = {
    entry: [
        "./src/index.js",
        "./src/index.html"
    ],
    output: {
        path: './dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './src',
        hot: true,
        inline: true,
        historyApiFallback: true,
        progress: true,
        stats: 'errors-only',
        colors: true,
        port: 3001,
        proxy: {
            '/api/*': "http://localhost:3000"
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
            {test: /\.html$/, exclude: /node_modules/, loader: 'file?name=[name].[ext]'},
            {test: /\.css$/, exclude: /node_modules/, loader: 'style!css'},
            {test: /\.(png|jpg)$/, exclude: /node_modules/, loader: 'file?name=[name].[ext]'}
        ]
    }
};
