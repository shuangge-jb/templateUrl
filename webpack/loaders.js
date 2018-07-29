const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  htmlLoader: {
    test: /\.html$/,
    exclude: [/lib/, /node_modules/],
    use: "ng-cache-loader?prefix="
  },
  cssLoader: {
    test: /\.css$/,
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
      "css-loader"
    ]
  },
  babelLoader: {
    test: /\.js$/,
    exclude: [/lib/, /node_modules/],
    use: {
      loader: "babel-loader",
      options: {
        presets: ["babel-preset-env"]
      }
    }
    /* replaceTemplateUrl: {
      test: /\.js$/,
      loader: StringReplacePlugin.replace(["babel-loader"], {
        replacements: [
          {
            // (templateUrl)(\s)*=(\s)*('|")(/)?((\w*)/)+\w*.html('|")
            // (ng-include)(\s)*=(\s)*('|")(/)?((\w*)/)+\w*.html('|")
            // (templateUrl|ng-include)(\s)*=(\s)*('|")(/)?((\w*)/)+\w*.html('|")
            pattern: /(templateUrl|ng-include)\s*(=|:)\s*('|")\/?(\w*\/)+\w*.html('|")/g,
            replacement: function(match, p1, offset, string) {
              // console.log('-----------------', match);
              // console.log('match:', match);
              const index = match.indexOf('"') || match.indexOf("'");
              // console.log('index:', index);
              const prefix = match.substring(0, index + 1);
              // console.log('prefix:', prefix);
              const last = match.substring(match.lastIndexOf("/") + 1);
              // console.log('last:', last);
              const result = prefix + last;
              console.log("after replace:", result);
              return result;
            }
          }
        ]
      })
    },
    replaceFixture: {
      test: /\.js$/,
      loader: StringReplacePlugin.replace(["babel-loader"], {
        replacements: [
          {
            pattern: /((('|")\s*,\s*)|\[\s*)('|")fixture\/drdsFixture('|")\s*\]/g,
            replacement: function(match, p1, offset, string) {
              console.log("-----------------", match);
              console.log("match:", match);
              if (match[0] === "[") {
                return "[]";
              } else if (match[0] === "'" || match[0] === '"') {
                return match[0] + "]";
              } else {
                return match;
              }
            }
          }
        ]
      })
    } */
  }
};
