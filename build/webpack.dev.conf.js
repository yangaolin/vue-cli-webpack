'use strict'
// 引入工具函数
const utils = require('./utils')
// 引入webpack
const webpack = require('webpack')
// 引入config/index.js配置
const config = require('../config')
//可以把分开配置的config合并，分开生产环境和调试环境
const merge = require('webpack-merge')
//node.js用来处理路径的包
const path = require('path')
//引入基础配置
const baseWebpackConfig = require('./webpack.base.conf')
//负责拷贝的工作
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 生成html并将打包后的js插入
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 友好提示的插件 https://github.com/geowarin/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查找可用端口 // github仓库 https://github.com/indexzero/node-portfinder
const portfinder = require('portfinder')
//node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --inline --progress --config build/webpack.dev.conf.js
//host
const HOST = process.env.HOST
//端口
const PORT = process.env.PORT && Number(process.env.PORT)

// 合并webpack的基础配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    //规定生成和处理css的方式 usePostCSS   Autoprefixer   为css添加合适的前缀
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development 
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 配置在客户端的日志等级，这会影响到你在浏览器开发者工具控制台里看到的日志内容。
    // clientLogLevel 是枚举类型，可取如下之一的值 none | error | warning | info。
    // 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志。
    // 这里是输出警告和错误信息
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，下面匹配的路径，出现404 响应都被替代为对应的路径 
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    //热更新  热模块更新作用。即修改或模块后，保存会自动更新，页面不用刷新呈现最新的效果。 
    //此处设置为true则webpack自动添加HotModuleReplacementPlugin
    //最终实现热更新是HotModuleReplacementPlugin
    hot: true,
    //配置 DevServer HTTP 服务器的文件根目录。
    //默认为false 即项目的根目录，所有一般情况下不必设置它，除非有额外的文件需要被 DevServer 服务。
    contentBase: false, // since we use CopyWebpackPlugin.
    //为代码进行压缩。加快开发流程和优化的作用。
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    //启动服务后是否自动打开浏览器
    open: config.dev.autoOpenBrowser, 
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,其实就是我们经常看到的那个报错页面
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // path指定编译目录（/build/js/），不能用于html中的js引用
    // 虚拟目录，自动指向path编译目录（/assets/ => /build/js/）。html中引用js文件时，引用此虚拟路径
    // 发布至生产环境：
    //1.webpack进行编译（到path路径下）
    //2.把编译目录下的文件，全部复制到publicPath目录下
    publicPath: config.dev.assetsPublicPath,
    //代理   驾驶舱   匹配   目标
    proxy: config.dev.proxyTable,
    //启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    // 开启后一般非常干净只有类似的提示 Your application is running here: http://localhost:8080
    quiet: true, // necessary for FriendlyErrorsPlugin
    //https://www.webpackjs.com/configuration/watch/
    //用来监听文件是否被改动过。
    //watchOptions: {
    //   aggregateTimeout: 300, 一旦第一个文件改变，在重新构建之前添加一个延迟。填以毫秒为单位的数字。
    //   poll: 1000， 填以毫秒为单位的数字。每隔（你设定的）多少时间查一下有没有文件改动过。不想启用可以填false。
    //   ignored: /node_modules/  观察许多文件系统会导致大量的CPU或内存使用量。可以排除一个巨大的文件夹。
    // }
    // 此处为flase
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    //此处定义为开发环境
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 热更新时显示具体的模块路径
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // inject 默认值 true，script标签位于html文件的 body 底部
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    // / 把资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // onErrors 是一个函数，出错输出错误信息，系统原生的通知
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

//此文件一共做了些什么
// 1、引入各种依赖，同时也引入了config文件夹下的变量和配置，和一个工具函数build/utils.js，
// 2、合并build/webpack.base.conf.js配置文件，
// 3、配置开发环境一些devServer，plugin等配置，
// 4、最后导出了一个Promise，根据配置的端口，寻找可用的端口来启动服务。
