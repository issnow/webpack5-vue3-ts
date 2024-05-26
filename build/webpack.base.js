// build/webpack.base.js
const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
module.exports = {
  entry: path.join(__dirname, '../src/index.ts'), // 入口文件
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },
  //webpack本身只能处理js、json,其他资源需要借助loader,webpack才能解析
  module: {
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          // 开发环境使用style-looader,打包模式抽离css
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      //{
      //  test: /\.(le|c)ss$/, //匹配 css 文件
      //  //use数组中loader执行顺序:从后向前,
      //  //style-loader:创建style标签,将js中的样式资源插入,添加到header中
      //  //css-loader:将css文件变成commonjs模块加载到js中,里面内容是样式字符串
      //  //less-loader:将less文件编译为css文件
      //  use: ['style-loader', 'css-loader', 'less-loader']
      //},
      {
        include: [path.resolve(__dirname, '../src')], //只对项目src文件的vue进行loader解析
        test: /\.vue$/, // 匹配.vue文件
        use: ['thread-loader', 'vue-loader'] // 用vue-loader去解析vue文件
      },
      {
        include: [path.resolve(__dirname, '../src')], //只对项目src文件的ts进行loader解析
        test: /\.ts$/,
        use: ['thread-loader', 'babel-loader']
      },
      // 如果使用到了js，可以把js文件配置加上
      // {
      //  test: /.(js)$/,
      //  use: 'babel-loader'
      // }
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      },
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
    //设置环境变量
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
    //创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块：
    alias: {
      '@': path.join(__dirname, '../src')
    },
    // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
    // 查找第三方模块只在本项目的node_modules中查找
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}



