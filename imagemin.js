var tinify = require("tinify");
tinify.key = "HnvJJnGoTK_5qLSkePBhrucOJ9EVVfeD";
var source = tinify.fromFile("index.jpg");
source.toFile("index2.jpg");