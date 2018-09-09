const path = require("path");
const loaders = require("./loaders");
const plugins = require("./plugins");

const isDev = process.env.NODE_ENV === "development";
const basePlugin = plugins.basePlugins;
const devPlugin = plugins.basePlugins;
const prodPlugin = plugins.prodPlugins;
const staticPath = !isDev ? "static/ddm/" : "";
const port=process.env.PORT||'8088';
module.exports = {
  devtool: isDev ? "source-map" : "none",
  mode: isDev ? "development" : "production",

  entry: {
    vendor: ["babel-polyfill"],
    main: ["./main"],
    businessAll: [
      `webpack-dev-server/client?http://localhost${port}/`,
      "./ddm_main"
    ]
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[hash:8].js",
    chunkFilename: `${staticPath}[name].[chunkhash:6].js`,
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
  plugins: basePlugin.concat(isDev ? devPlugin : prodPlugin)
};
