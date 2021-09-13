class About {
    constructor () {
        this.welcome()
    }

    welcome() {
        console.log(`欢迎你，这是about.js执行的代码，读取配置文件：${config.BaseUrl}`);
    }
}

new About()