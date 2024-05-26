// babel.config.js
/*
babel配置
1.presets:
预设,简单理解:一组babel插件,扩展babel功能
@babel/preset-env:一个智能预设,允许使用最新js,将es6转es5
@babel/preset-react:编译react jsx语法的预设
@babel/preset-typescript:编译ts语法的预设
@babel/preset-env配置方式，是会把当前浏览器缺失的API注入到全局的，那么有没有不注入全局的办法呢？
答案是有的。它就是我们接下来要讲的@babel/plugin-transform-runtime配置。
2.targets
经过测试，在@babel/preset-env里面设置targets是不行的
它的用法与 browserslist 一致。它可以用来设置我们的代码需要兼容的目标环境，因此它：
可以有效地减少ES6+的语法编译
可以有效控制polyfill导入多少
3.module
启用ES模块语法向另一种模块类型的转换,默认值：auto
可取的值："amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false
当我们设置成false的时候，Babel编译产生的一些辅助函数的引入方式会变成ES6的模式引入（import A from 'B'）。
这样有一个好处，就是我们用一些像Webpack打包工具时，可以对代码静态分析，很好地tree shaking减少代码体积，所以我们配置Babel的时候建议设置modules: false
4.corejs:当useBuiltIns不为false的时候，需要设置这个配置项
这个包就是我们上述polyfill模块所说的，里面存放了很多ES6+ API的方法与实现。如果要在旧浏览用到Promise、Symbol、Array.prototype.includes等方法时，这个包会为我们提供。它可以使那些不支持API的浏览器，支持这些API，它就是一种垫片。
5.useBuiltIns
6.@babel/plugin-transform-runtime
7.helpers && regenerator
8.corejs这个配置项一旦不为false，就是用来设置我们的要垫平的ES6+ API，以不污染全局局部变量方式垫平
所以，如果我们不想以全局的方式污染的方式垫平我们的ES6+ API，我们corejs就不能为false，并且优先使用@babel/runtime-corejs3这个包来垫平（设置为3）
*/

module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  "presets": [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        "corejs": 3 // 配置使用core-js使用的版本
      }
    ],
    [
      "@babel/preset-typescript",
      {
        allExtensions: true, //支持所有文件扩展名，很关键
      },
    ],
  ]
}
