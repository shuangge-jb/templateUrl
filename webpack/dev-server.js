const webpack = require("webpack");

const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);
const middleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware")
const express = require("express");
const path = require("path");
const app = express();

// webpackConfig.entry.businessAll.push("webpack-dev-server/client?http://localhost:8088/");
app.use(
  middleware(compiler, {
    contentBase: path.join(__dirname, "build"),
    // publicPath: path.join(__dirname, "build"),
    host: "0.0.0.0",
    port: 8088,
    hot: true,
    watchContentBase: true,
    logLevel: "debug",
    noInfo: true, 
    publicPath: webpackConfig.output.publicPath
    // writeToDisk: true
  })
);
const hotMiddleware = webpackHotMiddleware(compiler);
app.use(hotMiddleware);
app.listen(8088, () => console.log("Example app listening on port 8088!"));
