const puppeteer = require('puppeteer');
const fs = require("fs");
var extraLibs = process.argv.slice(2);
console.log("开始解析插件资源...");
puppeteer.launch({headless: true}).then(function(browser){
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