const webpack = require("webpack");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const mock = require("./mock");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const app = new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, "build"),
  host: "0.0.0.0",
  port: 8088,
  hot: true,
  watchContentBase: true,
  clientLogLevel: "info",
  before: mock.mock,
  proxy: {
    "/rest/v1.0/orders": {
      target: "http://localhost:8080"
    },
  }
  // logLevel: "debug",
  // noInfo: true,
  // publicPath: webpackConfig.output.publicPath
  // writeToDisk: true
});

app.listen(8088, () => console.log("Example app listening on port 8088!"));
