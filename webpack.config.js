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
        ]
    },
    resolve: {
        fallback: {
            buffer: require.resolve("buffer/"),
            timers: require.resolve("timers-browserify")
        }
    }
})