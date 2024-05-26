// build/webpack.base.js
const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
module.exports = {
  entry: path.join(__dirname, '../src/index.ts'), // 入口文件
  // 打包文件出口
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  //webpack本身只能处理js、json,其他资源需要借助loader,webpack才能解析
  module: {
    rules: [
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{
          filename:'static/images/[name][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /\.(le|c)ss$/, //匹配 css 文件
        //use数组中loader执行顺序:从后向前,
        //style-loader:创建style标签,将js中的样式资源插入,添加到header中
        //css-loader:将css文件变成commonjs模块加载到js中,里面内容是样式字符串
        //less-loader:将less文件编译为css文件
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.vue$/, // 匹配.vue文件
        use: 'vue-loader', // 用vue-loader去解析vue文件
      },
      {
        test: /\.ts$/,
        use: 'babel-loader'
      },
      // 如果使用到了js，可以把js文件配置加上
      // {
      //  test: /.(js)$/,
      //  use: 'babel-loader'
      // }
    ]
  },
  //扩展webpack功能
  plugins: [
    new VueLoaderPlugin(), // vue-loader插件
    //自动生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)。
    //https://juejin.cn/post/6844903853708541959?searchId=20240102000756E2C62D076EA23DDFD6EB
    new HtmlWebpackPlugin({
      //title: "Development",//设置head中的title标签
      //filename: "index.html",//生成 html 文件的文件名。默认为 index.html.
      //根据指定的模板文件来生成特定的 html 文件,模板取定义root节点的模板
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true, // 自动注入静态资源
    }),
    //Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__, __VUE_PROD_HYDRATI
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  // 配置模块如何解析
  resolve: {
    // 配置路径省略后缀名,默认js json
    extensions: ['.vue', '.ts', '.js', '.json'],
  }
}



