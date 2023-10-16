const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
// const Dotenv = require('dotenv').config({path: path.resolve(__dirname, './client/.env')});

module.exports = (env: any, argv:any) => {

  const mode = argv.mode || 'development';

  const dotEnv = new webpack.DefinePlugin({
    "process.env": {
      'DOMAIN': JSON.stringify(process.env.DOMAIN),
      'PORT': JSON.stringify(process.env.PORT),

      // PRODUCTION
      // Testing Purposes Only - never save production environment variables in local files.
      // Tests will require updating config.ts as well
      'DOMAIN_PD': JSON.stringify(process.env.DOMAIN_PD),
      'PORT_PD': JSON.stringify(process.env.PORT_PD),
   }
});

  return {
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000
	  },
    mode,
    stats: {
      errorDetails: true
    },
    entry: {
      bundle: './renderer/src/index.tsx' 
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true, // this will run dev from RAM rather than storing to HDD, and for npm run build it deletes old build files
      assetModuleFilename: '[name][ext]', // this makes sure that the name remains the same during compilation
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
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.jsx', '.js', '.tsx', '.ts'],
    },
    // plugins: [
    //   new HtmlWebpackPlugin({
    //     title: 'Konstellation',
    //     template: './client/index.html',
    //     filename: './index.html',
    //     // favicon: './client/favicon.ico',
    //   }),
    //   new CopyPlugin({
    //     patterns: [{ from: './client/style.css' }],
    //   }),
    //   dotEnv
    // ],
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, './dist'),
        publicPath: '/',
      },
      proxy: {
        '/api': 'http://localhost:3000',
        secure: false,
      },
      compress: false,
      host: 'localhost',
      port: 8080,
      hot: true,
      historyApiFallback: true,
    },
  };
  }
