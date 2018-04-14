// express 框架部分
const express = require('express')
const app = express()
// 站点配置
const config = require('./config')
// 工具函数
const { OpenBrowser } = require('./utils')
// 核心，需要被 express 托管的静态资源文件路径
app.use(express.static('./dist'))

// 监听 1314 端口，运行网站
app.listen(config.nodeService.port, () =>  OpenBrowser() );