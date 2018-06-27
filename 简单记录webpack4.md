# webpack 最近升级到了 v4.5+版

######  01 官方不再支持 node4 以下版本

```
官方不再支持 node4 以下版本

官方不再支持 node4 以下的版本,所以如果你的node版本太低，先开始升级node吧！

话说node10 都出来了一段时间了,想必现在没人会去装 node v4 以下的版本了,node官网都已经宣布node4.x已经结束使命了。
```
###### 02cli功能移到了webpack-cli

```
cli功能移到了webpack-cli

cli功能从webpack移到了webpack-cli，所以如果你要使用cli功能，除了安装 webpack 外，还需要安装 webpack-cli （基本都会使用cli ~）

yarn add -D webpack webpack-cli (npm install)
```
###### 03用新配置项mode配置生产或开发环境
```
用新配置项mode配置生产或开发环境

用新的配置项--mode配置生产或开发环境 (mode 可以是production或development或none)。

可以在 webpack 命令加上--mode参数，或者在 webpack 配置文件中加上。
```
```
{
    "scripts":{
        "dev": "webpack --mode development",
        "build": "webpack --mode production"
    }
}
```
```
var config = {
    mode: 'production',
    entry: {
        ventor: ['react','react-dom','promise','classnames'],
        index:index
    },
    output: {
        path:dist,
        chunkFilename: '[name].js',
        filename: isDev ? '[name].js' : '[name].[chunkhash].js'
    },
    devtool: isDev ? 'source-map' : false
    ...
}
```
```
production 模式会开启各种特性优化构建，
使用 scope hoisting 和 tree-shaking,
自动启用 uglifyjs 对代码进行压缩,
并且会自动将 process.env.NODE_ENV 设置为production。
development 模式主要会优化开发时的增量构建，
另外 process.env.NODE_ENV 会被设置为development,无需再用 define 插件定义。
```
###### 04开始使用optimization.splitChunks
```
开始使用optimization.splitChunks

CommonsChunkPlugin被废弃，开始使用optimization.splitChunks

之前我们做代码分割，少不了用 CommonsChunkPlugin 分离 vendor 和app代码。
```
###### 05提取 css
```
ExtractTextWebpackPlugin 和 mini-css-extract-plugin 提取 css。

这两个插件都可以用于提取 css 到独立的文件，
ExtractTextWebpackPlugin 是 webpack v4 前大家都使用的插件， 
现在也支持 webpack v4(不过在使用的时候发现有时会生成一些空的css文件), 
而 mini-css-extract-plugin 是一个轻量级易于使用的基于 webpack v4 的插件，使用后感觉性能更好，大家可以尝试。
```
###### 06其他调整项备忘
```
NoEmitOnErrorsPlugin- > optimization.noEmitOnErrors（默认情况下处于生产模式）
ModuleConcatenationPlugin- > optimization.concatenateModules（默认情况下处于生产模式）
NamedModulesPlugin- > optimization.namedModules（在开发模式下默认开启）
webpack命令优化 -> 发布了独立的 webpack-cli 命令行工具包
webpack-dev-server -> 建议升级到最新版本
html-webpack-plugin -> 建议升级到的最新版本
file-loader -> 建议升级到最新版本
url-loader -> 建议升级到最新版本
```