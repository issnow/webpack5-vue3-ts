// build/webpack.dev.js
const path = require('path')
const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
  //此选项控制是否生成，以及如何生成 source map。例如:报错的时候是否看到行号
  devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲,build:slow rebuild:fast; original lines
  //webpack-dev-server 开发服务器,在内存编译打包, 提供了一个基本的 web server，并具有实时重新加载的功能
  //webpack-dev-server官方地址： https://www.webpackjs.com/configuration/dev-server/
  devServer: {
    port: 3000, // 服务端口号
    host: 'localhost',
    open: true,//告诉 dev-server 在服务器已经启动后打开浏览器。设置其为 true 以打开你的默认浏览器。
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲vue3模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
    client: {
      progress: true, //在浏览器中以百分比显示编译进度
      overlay: false //当出现编译错误或警告时，在浏览器中显示全屏覆盖。
    },
    //为所有响应添加 headers：
    //headers: {
    //  'X-Custom-Foo': 'bar',
    //},
  }
})
