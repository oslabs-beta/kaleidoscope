const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    const mode = argv.mode || 'development';

    const config = {
    target: 'electron-renderer',

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    mode,
    entry: {
        bundle: './frontend/src/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true, // This will run dev from RAM rather than storing to HDD, and for npm run build, it deletes old build files
        assetModuleFilename: '[name][ext]', // This makes sure that the name remains the same during compilation
    },
    module: {   
        rules: [
    {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: 'file-loader',
        options: {
        name: 'images/[name].[ext]'
    },
    },
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
    },
    {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
    ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // Updated the file extensions
    },
    plugins: [
        new HtmlWebpackPlugin({
        title: 'Kaliedoscope',
        template: './frontend/public/index.html',
        filename: './index.html',
        }),
    ],
    devtool: 'source-map',
    devServer: {
        static: {
        directory: path.join(__dirname, './dist'),
        publicPath: '/',
        },
        proxy: {
        '/api': 'http://localhost:3002',
        secure: false,
        },
        compress: false,
        host: '0.0.0.0',
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
    };
    config.target = 'node';
    config.externals = {
      fs: 'commonjs fs',
    };
    return config;
};