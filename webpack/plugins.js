const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const cleanConfig = {
  root: path.resolve(__dirname, "../"),
  // exclude: ['shared.js'],
  verbose: true,
  dry: false
};
const isMock = process.env.IS_MOCK === "true";
const isBundleAnalyzer = process.env.IS_BUNDLE_ANALYZER === "true";

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
  filename: `module.[hash:8].css`,
  chunkFilename: "[id].css"
});
const speedMeasurePlugin = new SpeedMeasurePlugin();
const definePlugin = new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
});
const uglifyJsPlugin = new UglifyJsPlugin({
  sourceMap: true,
  cache: false,
  parallel: false,
  uglifyOptions: {
    mangle: false,
    output:{
      // comments :true
    }
  }
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
if (isBundleAnalyzer) {
  basePlugins.push(new BundleAnalyzerPlugin());
}
module.exports = {
  uglifyJsPlugin,
  speedMeasurePlugin,
  basePlugins,
  devPlugins,
  prodPlugins: []
};
