const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = () => {
  return {
    entry: {
      lexicon: './src/pub/lexicon.js',
      viewer: './src/pub/viewer.js',
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
      ]
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: true }),
    ],
  };
};
