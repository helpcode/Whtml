<p align="center"><img src="docs/_media/img/gen.svg"/></p>
<p align="center"><a href="http://nodejs.cn/"><img src="https://img.shields.io/badge/Node.js%20-v8.9.3-green.svg" alt="Node"></a> <a href="https://www.gulpjs.com.cn/"><img src="https://img.shields.io/badge/gulp.js-3.9.1-red.svg" alt="gulpjs"></a> <a href="http://www.expressjs.com.cn/"><img src="https://img.shields.io/badge/express.js-4.16.3-blue.svg" alt="expressjs"></a></p>

## WHtml

> 一款让你用更加丝滑的方式来编写传统前端HTML页面

- 1: 文档地址：[Whtml](https://helpcode.github.io/Whtml/#/)
- 2: 创想工作室QQ群：[399041912](http://shang.qq.com/wpa/qunwpa?idkey=6311ead3dd326b975b76cb90590535973515776cf83d0854c0dc7b4a5c9cebfb)


## 介绍

当你在编写传统HTML页面的时候是否曾经遇到过静态页面众多导致html，css，ja代码过度冗余，将大部分时间花在不断的ctrl+c，ctrl+v上，是否想过能将传统静态页面的公共部分例如头部和底部分离出来，不需要每次的复制粘贴，是否想过css代码频繁重复为何不能像写JavaScript那样封装成函数直接调用。

是否想过省去每次写css3时需要手动去加浏览器前缀的烦恼等，是否不想让自己辛勤编码的成果被别人轻而易举的获取到。是否抱怨过美工给的素材太大等。。。？


为何我们不能换种方式来进行更加优雅自动化的编码，我们只关心核心页面的编写，其他一切交给程序帮助我们自动化实现？


## 特性

`WHtml`能够让你获得以下更加爽快的体验：


- 1: 将静态页面组件化模块化，降低重复代码的重复编写。

- 2: 基于Node.js + Gulp 自动化构建项目，让前端的你无缝对接

- 3: 采用jade + less，用更加简洁高效的方式去书写html和css

- 4: 自动压缩合并编译html，css，JavaScript使的项目具备更加优秀的响应速度

- 5: 更加自由的框架配置和详细的中文代码注释，一键轻松配置源码实现定制化

- 6: 简洁明了的ES6+语法，代码赏心悦目，提升编码乐趣。

- 7: 程序实时编译同步你的每一行修改，删除，重命名，新建为你自动构建输出到 dist/，代码写完程序自动zip压缩打包，你需要做的是将zip发给你的后端即可。

- 9: ....等

更多的功能期待你的切身尝试！

## 版本更新

- 1.1.7
* 增加对`public`中第三方css文件的编译支持
* 增加对字体文件夹`font`的编译支持
* 更改`less`为`stylus`，使语法更简洁美观
* 增加更多的代码详细的代码注释，一目了然

- 1.1.6
* `tinify` 速度实在太慢已去除这个模块，等白天我来自己写个。
* 修改优化 gulp 代码，去除冗余！

- 1.1.2
* 这个模块`tinify`超过500次使用就要钱，所以正在开发自己的图片压缩插件(尽请期待..)
* 去除gulp-imagemin模块，增加 `tinify` 模块的自动图片压缩

- 1.0.2
* 去除gulp.js图片压缩模块，因为这个模块问题太多用不了
* 根据朋友建议增加对css编译的修改，page/ 文件合并，public/ 公共模块不合并
* 根据朋友建议去除对 less，js，jade代码编译后的自动压缩
* 增加更多源码注释

## 捐赠


如果你觉得 `WHtml` 对你有帮助，或者想对我微小的工作一点资瓷，欢迎给我提建议。