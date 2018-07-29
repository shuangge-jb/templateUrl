const path = require("path");
const loaders = require("./loaders");
const plugins = require("./plugins");

const isDev = process.env.NODE_ENV === "development";
const basePlugin = plugins.basePlugins;
const devPlugin = plugins.basePlugins;
const prodPlugin = plugins.prodPlugins;
module.exports = {
  devtool: "source-map",
  mode: isDev ? "development" : "production",
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "module.[hash:8]",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  entry: {
    vendor: ["babel-polyfill"],
    main: ["./main"],
    businessAll: [
      'webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false',
      "./ddm_main"
    ]
    // hotReplace:
  },
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "[name].[hash:8].js",
    // publicPath: path.join(__dirname,"./"),
    //   library: "businessAll",
    //   libraryTarget: "amd"
    //   chunkFilename: "[name].chunk.js"
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "../src"),
      "fixtures/drdsFixture": path.resolve(
        __dirname,
        "../fixtures/drdsFixture"
      ),
      theme: path.resolve(__dirname, "../theme")
    }
  },
  externals: {
    angular: "angular",
    uiRouter: "angular-ui-router",
    requirejs: "requirejs",
    i18n: "i18n",
    "fixture/drdsFixture": "fixture/drdsFixture"
  },
  module: {
    rules: [loaders.htmlLoader, /*  loaders.cssLoader, */ loaders.babelLoader]
  },
  plugins: basePlugin.concat(isDev ? devPlugin : prodPlugin)
};
/*  {
    devtool: "source-map",
    mode: isDev ? "development" : "production",
    entry: {
      main: path.resolve(__dirname, "../main")
    },
    output: {
      path: path.resolve(__dirname, "../build"),
      filename: "main.js"
    },
    plugins: basePlugin.concat(isDev ? devPlugin : prodPlugin),
    module: {
      rules: [loaders.htmlLoader, loaders.babelLoader]
    }
  },
  {
    mode: "production",
    entry: ["babel-polyfill"],
    output: {
      path: path.resolve(__dirname, "../build"),
      filename: "vendor.js"
    }
  } */
