'use strict'
// 引入node路径相关
const path = require('path')
// 引入utils工具函数
const utils = require('./utils')
// 引入webpack
const webpack = require('webpack')
// 引入config/index.js配置文件
const config = require('../config')
// 合并webpack配置的插件
const merge = require('webpack-merge')
// webpack基础配置
const baseWebpackConfig = require('./webpack.base.conf')
// 拷贝文件和文件夹的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 生成HTML的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//提取css的插件 将所有css压缩提取到一个文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//压缩css的插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//压缩JS的插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')
// 合并webpack基础配置
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 通过styleLoaders函数生成样式的一些规则
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      // 是否提取css到单独的css文件
      extract: true,
      // 是否使用postcss
      usePostCSS: true
    })
  },
  // 配置使用sourceMap true 这里是 #source-map
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 这里是根目录下的dist  通过HtmlWebpackPlugin插件生成的html文件存放在这个目录下面
    path: config.build.assetsRoot,
    // 文件名称  //编译生成的js文件存放到根目录下面的js目录下面,如果js目录不存在则自动创建
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    //chunkname 在按需加载（异步）模块的时候 require.ensure(["XXX.js"]
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false //去除警告
          // 构建后的文件 常用的配置还有这些
          // 去除console.log 默认为false。  传入true会丢弃对console函数的调用。
          // drop_console: true,
          // 去除debugger
          // drop_debugger: true,
        }
      },
      // 是否开启sourceMap
      sourceMap: config.build.productionSourceMap,
      //使用多进程并行运行和文件缓存来提高构建速度
      parallel: true
    }),
    // 提取css到单独的css文件
    // extract css into its own file
    new ExtractTextPlugin({
      // 提取到相应的文件名 使用内容hash contenthash
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      // allChunks 默认是false,true指提取所有chunks包括动态引入的组件。
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩css的配置
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      // inject 默认值 true，script标签位于html文件的 body 底部
      inject: true,
      // 压缩
      minify: {
        // 删除注释
        removeComments: true,
        // 删除空格和换行
        collapseWhitespace: true,
        // 删除html标签中属性的双引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 这个选项决定了 script 标签的引用顺序 按照不同文件的依赖关系来排序。
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 根据代码内容生成普通模块的id，确保源码不变，moduleID不变。
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // 开启作用域提升 作用是让代码文件更小、运行的更快
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 提取公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      // 把公共的部分放到 manifest 中
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // 提取动态组件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      // 最小3个，包含3，chunk的时候提取
      minChunks: 3
    }),

    // copy custom static assets
    // 把static资源复制到相应目录。
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
//如果开始gzip压缩，使用compression-webpack-plugin插件处理。这里配置是false
// 需要使用需要安装 npm i compression-webpack-plugin -D
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
//可视化分析
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

// 1、引入一些插件和配置，其中引入了build/webpack.base.conf.js webpack基本配置文件，
// 2、用DefinePlugin定义环境，
// 3、合并基本配置，定义自己的配置webpackConfig，配置了一些modules下的rules，devtools配置，output输出配置，一些处理js、提取css、压缩css、输出html插件、提取公共代码等的
// plugins，
// 4、如果启用gzip，再使用相应的插件处理，
// 5、如果启用了分析打包后的插件，则用webpack-bundle-analyzer，
// 6、最后导出这份配置。
