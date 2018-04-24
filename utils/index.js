/**
 * 全局公共函数
 */

// 自动打开浏览器
const open = require('open');
// 配置信息
const config = require('./../config')
// 终端输出颜色
const clc = require('cli-color')
// 文件操作
const fs = require("fs")
// 路径操作
const path = require("path")
// 获取文件基准地址
const Base = path.resolve(__dirname, '../dist')

/**
 * 返回完整的网址
 */
const URL = () => `${config.nodeService.host}${config.nodeService.port}`

/**
 * open 模块： 自动打开浏览器
 * 模块地址：https://github.com/pwnall/node-open
 */
const OpenBrowser = () => {
    Notice(`${config.nodeService.log}${URL()}`)
    config.nodeService.isOpenBrowser ? open(URL()) : ''
}

/**
 * cli-color 模块：设置终端运行信息的颜色
 * @param {*string} log 需要log的信息
 * 模块地址： https://github.com/medikoo/cli-color
 */
const Notice = (log) => {
    // 终端输入运行的颜色
    let notice = clc.greenBright.bold;
    console.log(notice(log));    
}

/**
 * 当前端从src源码中删除某文件(jade，js，img)的时候，那么删除对应dist/中编译后文件
 * @param {*string} filename 
 */
const RemoveFile = (filename) => {
    if(SearchKey(filename,'jade')){
        deleteFile(ReturnFullUrl(ReturnFileName(filename,'jade'),'html'))
    }else if(SearchKey(filename,'js')){
        deleteFile(ReturnFullUrl(ReturnFileName(filename,'js'),'js'))
    }else if(SearchKey(filename,'styl') || 
    SearchKey(filename,'mp3')){
        Notice("忽略该文件...")
    }else{
        deleteFile(`${Base}/img/${filename}`)
    }
}

/**
 * 返回对应文件类型的 文件地址
 * @param {*string} name 需要删除的文件名称
 * @param {*string} type 需要删除的文件类型
 */
const ReturnFullUrl = (name, type) => {
    switch(type) {
        case 'html': return `${Base}/${name}${type}`; break;
        case 'js': return `${Base}/js/${name}${type}`; break;
        default:; break; 
    }
}

/**
 * 返回的文件名称，例如 index.jade，返回 index
 * @param {*string} file 文件完整名称
 * @param {*string} plug 需要检测的文件后缀
 */
const ReturnFileName = (file, plug) => file.replace(plug,"") 


/**
 * 删除文件
 * @param {*string} path 文件路径
 */
const deleteFile = (path) =>  fs.unlink(path, (err) => err ? console.error(err) : Notice(`${path} 对应文件已删除...`))

/**
 * 检索字符串中是否有匹配的字符
 * @param {*string} key 需要检索的字符串
 */
const SearchKey = (par, key) => par.indexOf(key) != -1 ? true : false


module.exports = { OpenBrowser, RemoveFile }