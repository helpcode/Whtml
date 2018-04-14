
module.exports = {
    "jade":{
        // jade -> html 需要监听转换的jade文件路径
        "jadeTohtml": "./src/view/main/*.jade",
        // html 输出的路径
        "jadeTodist": "./dist/"
    },
    "less":{
        // less -> css 需要监听转换的less文件路径
        "lessTocss": "./src/assets/css/*.less",
        // less 转换完成后，需要将多个文件合并成一个的文件名
        "lessToFileName":"main.css",
        // css 输出的路径
        "lessTodist":"./dist/css/"
    },
    "watch":{
        // gulp 需要监听的文件路径，当我们在src修改源码时，gulp会动态编译输出到dist
        "watchFile":"src/**/*"
    },
    "nodeService": {
        // 访问ip
        "host":"http://127.0.0.1:",
        // 访问端口
        "port": 1314,
        // 提示信息
        "log":"项目运行在:",
        // 是否开始自动打开浏览器功能，取值：true，false
        "isOpenBrowser": false
    }
}