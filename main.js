var Fontmin = require('fontmin');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

const fontFile = "font/*.ttf"; //要压缩的字体文件
const outputFolder = "dist"; //输出目录
const textSourceFolder = "E:\\WorkSpace\\2021-06-13爱创官网\\web-2\\src"; //需要提取文字的文件目录
const fileExt = ".vue"; //提取文字的文件后缀





var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        // 排除static静态目录（可按你需求进行新增）
        if (file === 'static') {
            return false
        }
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file))
        } else {
            // 过滤后缀名（可按你需求进行新增）
            if (path.extname(file) === fileExt) {
                results.push(path.resolve(__dirname, file))
            }
        }
    })
    return results
}

function delHtml(str) {
    return str.replace(/]+>/g, "").replace(/\s/g, ""); //正则去掉所有的html标记

}

var files = walk(textSourceFolder);
var text = ''
files.forEach(file => {
    $ = cheerio.load(fs.readFileSync(file));
    text += delHtml($("template").text());
});
console.warn(text);

var fontmin = new Fontmin()
    .src(fontFile)
    .dest(outputFolder).use(
        Fontmin.glyph({
            text: text,
            hinting: false
        })
    );

fontmin.run(function(err, files) {
    if (err) {
        throw err;
    }
});