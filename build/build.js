'use strict'
// 检查node npm的版本
require('./check-versions')()

process.env.NODE_ENV = 'production'
// 命令行中的loading
const ora = require('ora')
// 删除文件或文件夹
const rm = require('rimraf')
// 路径相关
const path = require('path')
//控制台输入的样式
const chalk = require('chalk')
// 引入webpack
const webpack = require('webpack')
// 引入config/index.js
const config = require('../config')
// 引入 生产环境webpack配置
const webpackConfig = require('./webpack.prod.conf')
// 控制台输入开始构建loading
const spinner = ora('building for production...')
spinner.start()
// 删除原有构建输出的目录文件 这里是dist 和 static
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // 如果出错，抛出错误
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    //关闭
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    // 如果有错，控制台输出构建失败
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    // 控制台输出构建成功相关信息
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
// 1、引入build/check-versions文件，检查node和npm的版本，
// 2、引入相关插件和配置，其中引入了webpack生产环境的配置build/webpack.prod.conf.js，
// 3、先控制台输出loading，删除dist目录下的文件，开始构建，构建失败和构建成功都给出相应的提示信息。
