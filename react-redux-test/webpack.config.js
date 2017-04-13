/**
 * Created by Sheldon Lee on 4/12/2017.
 */
module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname + '/public',
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015']
            }
        },{
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        },{
            test: /\.(jpg|png|svg)$/,
            exclude: /node_modules/,
            loader: 'url-loader'
        }]
    },
    resolve: {
        extensions: ['*','.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './public'
    },
    devtool: "inline-sourcemap"
};