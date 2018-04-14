## 环境准备

---

### windows

首先安装最基本的Node.js环境，先去官网下载最新版的nodejs，记住根据你的操作系统和位数选择下载。

> 官网地址: [http://nodejs.cn/download/](http://nodejs.cn/download/)

虽然在Windows上安装很简单，但是为了避免错误具体的安装过程参考这篇教程：

[Node.js 安装配置 http://nodejs.cn/download/](http://nodejs.cn/download/)

!> 注意：安装nodejs的路径杜绝使用中文，记住杜绝包含中文的路径！！！

### Linux

Linux下安装比Windows稍微麻烦一点点，这边安装方式很多。不推荐用`apt-get install xxx` 来安装，因为版本老旧。也不推荐下载文件然后改配置，个人感觉不好(你也可以选择这种方法)。

我这边推荐使用的方法是：**编译源码安装**


具体操作看这篇教程，不再累述：

> [Linux安装Node.js（源码编译安装）](https://www.yiibai.com/html/node_js/2013/0826201.html)

## 部署代码

---

上面的步骤很简单没有什么可说的，假设你已经完美安装成功，那么我们开始愉快的部署代码吧。

**1: 解决依赖**

---

命令提示符界面输入命令

> npm install

如果npm下载速度十分缓慢，请更换npm为cnpm，具体操作百度，太简单懒得详细说！！

成功更换为cnpm后名称变为下面：

> cnpm install

OK，到这一步基本上我们的框架就可以被成功的运行起来来。

查看`package.json`文件中`scripts`字段，你可以通过命令：

> npm run all 

来运行框架。
