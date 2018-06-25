'use strict'
const path = require('path')
// 引入工具函数
const utils = require('./utils')
// 引入配置文件
const config = require('../config')
// 引入vue-loader的配置文件
const vueLoaderConfig = require('./vue-loader.conf')
// 定义获取绝对路径函数
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  // 运行环境的上下文，就是实际的目录，也就是项目根目录
  context: path.resolve(__dirname, '../'),
  // 入口
  entry: {
    app: './src/main.js'
  },
  // 路径 这里是根目录下的dist
  output: {
    path: config.build.assetsRoot,
    //文件名
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      // 这里是 /，上线时这里路径会不对，需要修改为./
      ? config.build.assetsPublicPath
      // 这里配置是 /
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 配置了这个，对应的扩展名可以省略
    extensions: ['.js', '.vue', '.json'],
    // src别名 比如 ：引入import HelloWorld from '@/components/HelloWorld'
    alias: {
      '@': resolve('src'),
    }
  },
  // 定义一些文件的转换规则
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        // js文件使用babel-loader转换
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        // 图片文件使用url-loader转换
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 限制大小10000B(bytes)以内，转成base64编码的dataURL字符串
          limit: 10000,
          // 输出路径 img/名称.7位hash.扩展名
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // 视频文件使用url-loader转换
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        //图标字体等
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 这里的node是一个对象，其中每个属性都是 Node.js 全局变量或模块的名称，每个 value 是以下其中之一
  // empty 提供空对象。
  // false 什么都不提供。
  // 更多查看 https://webpack.docschina.org/configuration/node/
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    // 防止webpack注入一些polyfill 因为Vue已经包含了这些
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

// 这个文件主要做了以下几件事情：
// 1、引入各种插件、配置等，其中引入了build/vue-loader.conf.js相关配置，
// 2、导出webpack配置对象，其中包含context，入口entry，输出output，resolve，module下的rules（处理对应文件的规则），和node相关的配置等
