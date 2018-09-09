const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
  const staticPath = process.env.NODE_ENV === "production" ? "static/ddm/" : "";
const cleanConfig = {
  root: path.resolve(__dirname, "../"),
  // exclude: ['shared.js'],
  verbose: true,
  dry: false
};
const isMock = process.env.IS_MOCK === "true";

const cleanWebpackPlugin = new CleanWebpackPlugin(["./build"], cleanConfig);
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: "index.ejs"
});
const copyWebpackPlugin = new CopyWebpackPlugin([
  {
    from: "lib/*",
    to: "./"
  }
]);
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: `${staticPath}module.[hash:8].css`,
  chunkFilename: "[id].css"
});
const definePlugin = new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
});
const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin({});
const basePlugins = [
  cleanWebpackPlugin,
  htmlWebpackPlugin,
  copyWebpackPlugin,
  miniCssExtractPlugin,
  definePlugin
];
const devPlugins = [hotModuleReplacementPlugin];
console.log("is mock:-------------", isMock);
if (isMock) {
  basePlugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
  basePlugins: basePlugins,
  devPlugins: devPlugins,
  prodPlugins: []
};
