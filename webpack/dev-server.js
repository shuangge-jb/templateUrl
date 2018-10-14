const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const apiMocker = require("webpack-api-mocker");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const mock = require("./mock");

const port = Number.parseInt(process.env.PORT || "8088", 10);
const proxyPort = process.env.PROXY_PORT || "2999";
const isMock = process.env.IS_MOCK === "true";

function getMocker(isMock) {
  const mocker = app =>
    apiMocker(app, path.resolve(__dirname, "../mock/index.js"), {
      proxy: {},
      changeHost: true
    });
  return isMock ? mocker : mock.mock;
}

const app = new WebpackDevServer(compiler, {
  contentBase: path.resolve(__dirname, "../build"),
  host: "0.0.0.0",
  port: port,
  hot: true,
  watchContentBase: true,
  clientLogLevel: "info",
  before: getMocker(isMock),
  proxy: {
    "/rest/v1.0/orders": {
      target: `http://localhost:${proxyPort}`
    }
  }
  // logLevel: "debug",
  // noInfo: true,
  // publicPath: webpackConfig.output.publicPath
  // writeToDisk: true
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
