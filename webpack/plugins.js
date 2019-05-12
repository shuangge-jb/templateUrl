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
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const ConcatPlugin = require("webpack-concat-plugin");

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
  template: "index.ejs",
  inlineSource: ".(js|css)",
  templateParameters:{
    // toggle:require('../toggle')
  }
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
  filename: `module.[contenthash].css`,
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
    output: {
      // comments :true
    }
  }
});
const dllPlugin = new webpack.DllPlugin({
  name: "[name]_[hash]",
  path: path.resolve(__dirname, "..", "build")
});
// const dllRefernecePlugin = new webpack.DllReferencePlugin({
//   manifest: require("../build/manifest.json")
// });
const htmlWebpackInlineSourcePlugin = new HtmlWebpackInlineSourcePlugin();
const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin({});
const concatPlugin = new ConcatPlugin({
  // examples
  uglify: false,
  sourceMap: false,
  name: "toggle",
  // outputPath: "./",
  fileName: "[name].[hash].js",
  filesToConcat: [
    "./toggle.js",
  ],
  attributes: {
    async: true
  }
});

const basePlugins = [
  cleanWebpackPlugin,
  htmlWebpackPlugin,
  copyWebpackPlugin,
  miniCssExtractPlugin,
  definePlugin,
  // dllPlugin,
  // dllRefernecePlugin,
  htmlWebpackInlineSourcePlugin,
  // concatPlugin,
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
