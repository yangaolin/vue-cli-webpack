'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    // 是否开启sourceMap，便于调试
    sourceMap: sourceMapEnabled,
    // 是否提取vue单文件的css
    extract: isProduction
  }),
  // 是否开启cssSourceMap，便于调试
  cssSourceMap: sourceMapEnabled,
  // 这里是true
  // 缓存破坏，进行sourceMap debug时，设置成false很有帮助。
  cacheBusting: config.dev.cacheBusting,
  // vue单文件中，在模板中的图片等资源引用转成require的形式。以便目标资源可以由 webpack 处理。
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    // 默认配置会转换 <img> 标签上的 src 属性和 SVG 的 <image> 标签上的 xlink：href 属性。
    image: 'xlink:href'
  }
}
// 这个文件主要导出了一份Vue-loader的配置，
// 主要有：loaders，cssSourceMap，cacheBusting，transformToRequire。