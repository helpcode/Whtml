## 目录解读

---

首先我们来看以下框架的文件层级结构，从宏观上了解以下框架的基本架构，然后我们在一一解读其具体的源码实现，目录结构图如下：

```html
.
├── app.js      #通过nodejs的web框架express来启动打包后的dist/静态网站
├── config      #基本信息配置，一般修改这里即可实现订制
│   └── index.js
├── dist        # gulp编译src产生的文件，我们写完静态页面需要交给后端的就是它
├── docs         # 框架的帮助文档
├── gulpfile.js  # 最核心的 gulp 配置文件，看不懂源码情况下不要修改
├── Online.zip   # gulp 自动zip打包 dist/ 文件夹产生的，直接将这个压缩包发给后端，省事
├── package.json # 项目的基本核心配置，你懂的！看不懂源码情况下不要修改
├── .gitignore   #git 上传忽略文件配置
├── CHANGES.md   #版本更新日志
├── README.md    #帮助文档
├── src          # 核心源码，主要代码编写在这进行,在这的任何操作都会被同步映射更新到dist/
│   ├── assets   # 存放静态资源
│   │   ├── css  # css样式
│   │   │   ├── layout.styl      #css样式主入口，gulp将会从这里进行对css的编译打包
│   │   │   ├── page             #对应具体页面的css
│   │   │   │   ├── header.styl  #公共头部样式
│   │   │   │   └── index.styl   #首页的样式
│   │   │   └── public           #全局公共的样式
│   │   │       ├── colors.styl  #全局css颜色的封装
│   │   │       ├── lib.styl     #全局css方法的封装
|   |   |       ├── reset.styl   #清除浏览器默认样式
│   │   ├── img                  #网站用到的图片
│   │   │   └── gen.svg          #测试用的图片[测试可删除]
│   │   └── js                   #存放js脚本
│   │       ├── demo.js          #index.jade 页面组件的私有js文件[测试可删除]
│   │       └── jquery.js        #默认自带的 jquery
│   │   └── font                 #存放网站字体
│   │       ├── awesome.woff2    #测试用的字体[测试可删除]
│   └── view                     #存放页面的视图jade
│       ├── layout.jade          #页面试图的核心入口文件
│       ├── main                 #存放主要的页面
│       │   └── index.jade       #首页
│       └── public               #公共页面组件
│           ├── footer.jade      #公共版权
│           └── header.jade      #公共头部
└── utils                        #框架需要用的工具类
│   └── index.js
└── sh                           #shell脚本
    └── push.sh                  #自动提交代码到github

```

仔细阅读上面对各个文件的作用的解释，这里很关键。

