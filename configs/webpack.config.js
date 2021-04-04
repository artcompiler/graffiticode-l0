const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
module.exports = () => {
  return {
    entry: {
      lexicon: './src/lexicon.js',
      viewer: './src/viewer.jsx',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './../dist'),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    ],
  };
};
