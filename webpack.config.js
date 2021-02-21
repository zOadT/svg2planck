var MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
var path = require('path');
var sveltePreprocess = require('svelte-preprocess');

module.exports = (env, argv) => ({
    entry: {
        'build/bundle': ['./pages/main.ts']
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    devtool: "source-map",
    resolve: {
        alias: {
            svelte: path.dirname(require.resolve('svelte/package.json'))
        },
        extensions: ['.mjs', '.js', '.ts', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        // modules: [
        //     path.resolve('./src'),
        //     path.resolve('./node_modules'),
        // ],
        fallback: {
            buffer: require.resolve("buffer/"),
            timers: require.resolve("timers-browserify"),
            stream: require.resolve("stream-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
					loader: 'svelte-loader',
					options: {
						preprocess: sveltePreprocess()
					}
				}
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            },
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.ttf$/, use: ['file-loader'] },
            { test: /\.svg/, type: 'asset/source' }
        ]
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ['xml']
        })
    ],
})