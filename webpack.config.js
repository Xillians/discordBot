const path = require('path');
var nodeExternals = require('webpack-node-externals')
module.exports = {
    entry: './src/App.ts',
    externals: [nodeExternals()],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: "ts-loader"
            },
        ],
    },
    output: {
        filename: 'App.js',
        path: path.resolve(__dirname, './public'),
    },
    resolve: {
        extensions: [
            '.ts', '.js', '.json'
        ],
    },
    
    target: 'node',
};