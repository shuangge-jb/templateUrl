const webpack = require("webpack");
const path = require("path");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cleanConfig = {
  root: path.resolve(__dirname, "../"),
  // exclude: ['shared.js'],
  verbose: true,
  dry: false
};
module.exports = {
  basePlugins: [
    new cleanWebpackPlugin(["./build"], cleanConfig),
    new HtmlWebpackPlugin({
      template: "index.ejs",
      chunks: ["vendor", "main", "businessAll"]
    }),
    new copyWebpackPlugin([
      {
        from: "lib/*",
        to: "./"
      },
     /*  {
        from: "./main.js",
        to: "./"
      } */
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "theme.[hash:8].css",
      chunkFilename: "[id].css"
    }),
    
  ],
  devPlugins: [
    new webpack.HotModuleReplacementPlugin({}),
    // new webpack.NamedModulesPlugin(),
  ],
  prodPlugins: [new UglifyJsPlugin()]
};
