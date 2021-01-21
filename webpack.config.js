var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
var path = require('path');

module.exports = (env, argv) => ({
    entry: "./page.ts",
    output: {
        path: path.resolve(__dirname, "pages"),
        filename: "bundle.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules'),
        ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.ttf$/, use: ['file-loader'] }
        ]
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['xml']
        })
    ],
    resolve: {
        fallback: {
            buffer: require.resolve("buffer/"),
            timers: require.resolve("timers-browserify"),
            stream: require.resolve("stream-browserify")
        }
    }
})