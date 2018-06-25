'use strict'
const path = require('path')
const config = require('../config')
//提取css的插件 将所有css压缩提取到一个文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//引入package.json配置
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
    // 生成跨平台兼容的路径
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  // 作为参数传递进来的options对象
  // {
  //   // sourceMap这里是true
  //   sourceMap: true,
  //   // 是否提取css到单独的css文件
  //   extract: true,
  //   // 是否使用postcss
  //   usePostCSS: true
  // }
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 是否使用usePostCSS，来决定是否采用postcssLoader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        // 合并 loaderOptions 生成options
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 如果提取使用ExtractTextPlugin插件提取
    if (options.extract) {
      return ExtractTextPlugin.extract({
      // use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
      //fallback:编译后用什么loader来提取css文件
      //publicfile:用来覆盖项目路径,生成该css文件的文件路径
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // sass indentedSyntax 语法缩进，类似下方格式
    // #main
    //   color: blue
    //   font-size: 0.3em
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
// npm run dev 出错时， FriendlyErrorsPlugin插件 配置 onErrors输出错误信息
exports.createNotifierCallback = () => {
  // 'node-notifier'是一个跨平台系统通知的页面，当遇到错误时，它能用系统原生的推送方式给你推送信息
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
// 1、assetsPath返回输出路径，
// 2、cssLoaders返回相应的css-loader配置，
// 3、styleLoaders返回相应的处理样式的配置，
// 4、createNotifierCallback创建启动服务时出错时提示信息回调。