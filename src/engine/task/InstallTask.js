/**
 * @author xdh
 * @modify  xujw 2018-1-31
 * install命令执行任务,调用对应的解析器,解析js脚本,找出所有用户自定义的vui组件
 */
var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var pathUtils = require("../../utils/PathUtils");
var fileUtils = require("../../utils/FileUtils");
var childProcess = require("child_process");
var environment = require("../../utils/Environment");
var V3PlatformJar = require("../../jar/V3PlatformJar");
var Q = require("q");
var fs = require("fs");
const config=require('../../../package.json');
const path = require('path');
/* 解析器路径 */
const analyzerPath = __dirname.substr(0,__dirname.lastIndexOf(path.sep))+path.sep+"analyzer"+path.sep;

var InstallTask = function(params){
	this.deferred = Q.defer();
	this.engineContext = null;
	this.libs = null;
	ITask.call(this,params);
}

objectUtils.extend(InstallTask.prototype,ITask.prototype);
/* 根据配置文件运行不同的分析器 */
InstallTask.prototype.runAnalyzer=function(analyzer,jsFiles){
	var child = childProcess.fork(analyzerPath+analyzer,jsFiles);
	child.on("message",(function(task){
		return function(obj){
			console.log("插件分析完成");
			/* 由于phantom插件只能返回字符串类型数据,需转换为对象类型 */
			if(typeof obj == "string"){
				obj = JSON.parse(obj);
			}
			task.generateJar(obj);
		};
	})(this));
}

InstallTask.prototype.exe = function(ctx){
	this.engineContext = ctx;
	if(this.validateCfg()){
		var sources = environment.getV3Platform().sources;
		this.libs = this.search(sources);
		var jsFiles = fileUtils.filte(this.libs,".js");
		if(jsFiles.length>0){
			this.logResources(jsFiles);
			console.log("开始分析插件,请稍候...");
			if(config.analyzer=='puppeteer'){
				this.runAnalyzer('Puppeteer.js',jsFiles);
			}
			else if(config.analyzer=='phantomJS'){
				this.runAnalyzer('Phantom.js',jsFiles);
			}
		}else{
			console.warn("WARN: 未检索到任何可用的js资源，v平台插件打包将终止!");
			this.deferred.reject();
		}
	}
	return this.deferred.promise;
}

InstallTask.prototype.generateJar = function(componentDefines){
	console.log("开始生成v3平台jar文件...");
	try{
		var jar = new V3PlatformJar({
			"packageJson":environment.getPackageObj(),
			"libs":this.libs,
			"components":componentDefines,
			"tarballPath":environment.getTGZPath(),
			"dependencies":[]
		});
		this.engineContext.put("jar",jar);
		var deff = this.deferred;
		jar.persistence(function(archive){
			fs.unlinkSync(environment.getTGZPath());
			console.log("v3平台jar文件生成完成...");
			console.log('v3平台扩展插件打包完成，总共：'+archive.pointer()+"字节！");
			deff.resolve(jar);
		});
	}catch(e){
		console.error(e);
	}
};
//搜索资源
InstallTask.prototype.search = function(sources){
	sources = objectUtils.isArray(sources) ? sources:[sources];
	var libs = [];
	for(var i=0,l=sources.length;i<l;i++){
		var path = pathUtils.toPluginPath(sources[i]);
		console.log(path);
		if(fs.existsSync(path)){
			if(fileUtils.isFile(path)){
				libs.push(path);
			}else{//文件夹
				var paths = fileUtils.listFiles(path,true);
				for(var j=0,len=paths.length;j<len;j++){
					var p = paths[j];
					if(fileUtils.isFile(p)){
						libs.push(p);
					}
				}
			}
		}else{
			console.error("ERROR: package.json文件中v3Platform.sources配置有误，文件不存在！path="+path);
			this.deferred.reject();
		}
	}
	return libs;
};

//打印搜索到的资源	
InstallTask.prototype.logResources = function(libs){
	console.log("检索插件资源完成，检索到的资源如下：");
	for(var i=0,l=libs.length;i<l;i++){
		console.log(libs[i]);
	}
};

InstallTask.prototype.validateCfg = function(){
	var platformCfg = environment.getV3Platform();
	if(platformCfg){
		var sources = platformCfg.sources;
		if(sources){
			return true;
		}else{
			console.warn("WARN: package.json文件中没有配置sources属性，v3平台打包将终止！");
		}
	}else{
		console.warn("WARN: package.json文件中没有配置v3Platform属性，v3平台打包将终止！");
	}
	deferred.reject();
	return false;
};

InstallTask.prototype.handleError = function(ctx){
	var jar = ctx.get("jar");
	if(jar){
		var dist = jar.getDist();
		if(fs.existsSync(dist)){
			fs.unlinkSync(dist);
		}
		var sourceDist = jar.getSource();
		if(fs.existsSync(sourceDist)){
			fs.unlinkSync(sourceDist);
		}
	}
};

module.exports = InstallTask;
