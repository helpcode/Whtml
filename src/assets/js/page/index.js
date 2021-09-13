class Index {
    constructor () {
        this.click()
    }

    click() {
        $(".index p").click(function(){
            alert("你点我了")
        })
    }
}

new Index()