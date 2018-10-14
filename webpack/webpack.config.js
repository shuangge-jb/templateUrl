const path = require("path");
const loaders = require("./loaders");
const plugins = require("./plugins");

const basePlugin = plugins.basePlugins;
const devPlugin = plugins.basePlugins;
const prodPlugin = plugins.prodPlugins;
const port = process.env.PORT || "8088";
const isDev = process.env.NODE_ENV === "development";
const isDevServer = process.env.IS_DEV_SERVER === "true";
const isBundleAnalyzer = process.env.IS_BUNDLE_ANALYZER === "true";

function getPlugins(isDev, isDevServer) {
  const plugins = isDev ? basePlugin.concat(prodPlugin) : basePlugin;
  return isDevServer ? plugins.concat(devPlugin) : plugins;
}
function getEntries(isDevServer) {
  const businessAll = ["./ddm_main"];
  if (isDevServer) {
    businessAll.unshift(`webpack-dev-server/client?http://localhost:${port}/`);
  }
  return businessAll;
}

const config = {
  devtool: isDevServer ? "source-map" : "none",
  mode: isDev ? "development" : "production",

  entry: {
    vendor: ["babel-polyfill"],
    main: ["./main"],
    businessAll: getEntries(isDevServer)
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[hash:8].js",
    chunkFilename: `[name].[chunkhash:6].js`,
    publicPath: "./"
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "../src"),
      app: path.resolve(__dirname, "../src/app"),
      "fixtures/drdsFixture": path.resolve(
        __dirname,
        "../fixtures/drdsFixture"
      ),
      theme: path.resolve(__dirname, "../theme"),
      i18n: path.resolve(__dirname, "../i18n")
    }
  },
  externals: {
    angular: "angular",
    uiRouter: "angular-ui-router",
    requirejs: "requirejs",
    "fixture/drdsFixture": "fixture/drdsFixture"
  },
  module: {
    rules: [
      loaders.htmlLoader,
      loaders.cssLoader,
      loaders.fileLoader,
      loaders.urlLoader,
      loaders.eslintLoader,
      loaders.babelLoader
    ]
  },
  optimization: {
    minimizer: [plugins.uglifyJsPlugin]
  },
  plugins: getPlugins(isDev, isDevServer)
};

module.exports = isBundleAnalyzer
  ? plugins.speedMeasurePlugin.wrap(config)
  : config;
