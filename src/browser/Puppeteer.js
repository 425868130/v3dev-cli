const puppeteer = require('puppeteer');
const fs = require("fs");
/* 获取当前命令行路径 */
const cmdPath=process.cwd();
var extraLibs = process.argv.slice(2);
var pathUtils = require('../utils/PathUtils');
console.log("开始解析插件资源...");
/* 尝试读取命令行目录下的package.json文件 */
var packcof;
try{
 packcof=require(cmdPath+"/package.json");
}catch(e){
 packcof = undefined;
}
if(!packcof){
	console.log("配置文件读取失败,解析中断");
	return;
}
if(!pathUtils.isFile(packcof.chromiumpath)){
	console.log('浏览器路径错误,请到package.json文件中修改chromiumpath值');
	console.log('chromiumpath为本机chromium或chrome浏览器的执行文件路径!');
	return;
}

puppeteer.launch({headless: true,executablePath:packcof.chromiumpath}).then(function(browser){
	var err = function(e){
		console.log(e);
		browser.close();
	};
	browser.newPage().then(function(page){
		page.goto("file://"+__dirname+"/index.html").then(function(){
			var promises = [];
			for(var i=0,l=extraLibs.length;i<l;i++){
				var content = fs.readFileSync(extraLibs[i],'utf-8');
				if(content.length>0){
					var promise = page.evaluate(content);
					promises.push(promise);
				}
			}
			Promise.all(promises).then(function(){
				page.evaluate(function(){
					var searcher = new ExtensionComponentSearcher();
					return searcher.search();
				}).then(function(pool){
					console.log("解析插件资源完成...");
					process.send(pool);
					browser.close();
				},err);
			},err);
		},err);
	},err);
});