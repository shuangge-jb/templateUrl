const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  htmlLoader: {
    test: /\.html$/,
    exclude: [/lib/, /node_modules/],
    use: "ng-cache-loader?prefix="
  },
  cssLoader: {
    test: /\.less$|\.css$/,
    exclude: [/lib/, /node_modules/],
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          // you can specify a publicPath here
          // by default it use publicPath in webpackOptions.output
          // publicPath: "../"
        }
      },
      "css-loader",
      'less-loader'
    ]
  },
  urlLoader: {
    test: /\.(png|jpg|gif)$/,
    exclude: [/lib/, /node_modules/],
    use: [
      {
        loader: "url-loader?limit=1024",
        options: {
          // fallback: 'file-loader'
        }
      },
      // "file-loader"
    ]
  },
  fileLoader: {
    test: /\.(png|jpg|gif)$/,
    exclude: [/lib/, /node_modules/],
    use: {
      loader: `file-loader?name=theme/[name].[hash:6].[ext]`
    }
  },
  eslintLoader: {
    enforce: "pre",
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader"
  },
  babelLoader: {
    test: /\.js$/,
    exclude: [/lib/, /node_modules/],
    use: {
      loader: "babel-loader",
      options: {
        presets: ["babel-preset-env"],
        plugins: ["syntax-dynamic-import"]
      }
    }
  },
   lessLoader:{
     test:/\.less$/,
     use: [{
      loader: 'style-loader' // creates style nodes from JS strings
    }, {
      loader: 'css-loader' // translates CSS into CommonJS
    }, {
      loader: 'less-loader' // compiles Less to CSS
    }]
   }

};
