### DONE
#### 框架解耦
#### js加上哈希
#### 自动将打出来的包添加到index.html中
#### webpack.config.js中只导出一个对象，里面有3个entry
#### HMR做完
#### mini-css-plugin能自动把样式文件加到index.html中
#### 配置eslint
#### i18n打包成chunk
#### main.js参与打包，压缩，使用definePlugin替换环境变量
#### 生产环境打包不使用source map。使用'none'
#### ng-cache-loader 可以在bootstrap后再require html吗？（$templateCache 和angular.bootstrap的关系？）不行
#### 具备懒加载能力，conroller，service可以在bootstrap之后执行.思路：使用$controllerProvider.register,$provide.service,$filterProvider.register,$compileProvider.directive对业务模块进行config
#### 分chunk打包。思路：每个业务目录一个入口文件，将需要的所有js引入。在路由中使用resolve，动态引入chunk(使用require.ensure或者动态import)，返回promise

#### 使用动态import代替require.ensure。思路：安装babel-plugin-dynamic-import-webpack，babel-eslint，babel-loader配置plugins: ["dynamic-import-webpack"],eslintrc.json配置"parser": "babel-eslint"
#### 动态import时为chunk命名：e.g. System.import( "app/business/database/database"/*webpackChunkName:"database"*/)  注：一定要用System.import，不能直接用import，否则不生效。注释可以放在前面，也可以放在后面，注释中空格无影响。缺点：会出现警告：System.import() is deprecated and will be removed soon. Use import() instead.
#### 使用webpack bundle analyzer 分析chunk：将analyzer plugin 加到basePlugins中

### TODO
#### 没有分2种模式：直接调接口和本地mock
#### 尝试写一个引入图片的样式，通过打包将图片引入(file-loader已做完,url-loader未成功)
#### 从代码层面，在require前把fixture去掉，不影响源码
#### 了解一下如何自定义插件和loader
#### 多个string-replace执行时会很慢，原因？（loader的原理）
#### 在webpack的配置文件中使用import等语法(安装 动态import三方件？)
#### Promise.all 几个promise，有一个是链式调用
#### 如何将chunk放到不同目录下？
#### splitChunkPlugin，如何处理公共chunk?（满足什么条件才提取公共代码？）
#### 如何加快打包速度？

#### 如何require,import default的方法/对象？
#### 将promise用async await代替
#### 在Linux上使用ant脚本判断是否安装npm-cache，并安装npm-cache

### 注
#### require引入的顺序没有要求
#### 业务包无需返回promise，直接放到function中即可
#### main.js中无需使用window.require businessAll.js，可通过自动引入businessAll.js实现（前提：不设置libraryTarget和library,只有一个config对象，不分多个对象来设置）