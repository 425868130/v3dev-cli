/**
 * 同步服务器上的插件
 */
var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var environment = require("../../utils/Environment");
var fileUtils = require("../../utils/FileUtils");
var constant = require("../../utils/Constant");
var pathUtils = require("../../utils/PathUtils");
var needle = require("needle");
var Q = require("q");
var fs = require("fs");
var DecompressZip = require("decompress-zip");
var childProcess = require("child_process");

 var SyncTask = function(params){
 	this.deferred = Q.defer();
 	this.pluginsDir = null;
 	ITask.call(this,params);
 }

objectUtils.extend(SyncTask.prototype,ITask.prototype);

SyncTask.prototype.exe = function(ctx){
	if(this.validateConfig()){
		var platformCfg = environment.getV3Platform();
		var server = platformCfg.server;
		var url = server+constant.PLUGIN_DOWNLOAD_URL;
		var dir = fileUtils.getV3PluignTempRelativeDir();
		this.pluginsDir = pathUtils.toPluginPath(dir);
		var output = fileUtils.toV3PluginTempRelativePath(dir);
		var absPath = pathUtils.toPluginPath(output);
		fileUtils.makeDir(pathUtils.getParentPath(absPath));
		var task = this;
		needle.get(url, { 
			output: absPath
		}, function(err, resp, body) {
			try{
				var unArchivePath = pathUtils.toPluginPath(dir + "/unarchive");
				console.log("unArchivePath:"+unArchivePath);
				fileUtils.makeDir(unArchivePath);
				var unzipper = new DecompressZip(absPath);
				unzipper.on('error', function (err) {
				    console.error(err);
				    task.deferred.reject();
				});
				 
				unzipper.on('extract', function (log) {
				    var files = fileUtils.listFiles(unArchivePath,false,null);
					var pluginPaths = [];
					for(var i=0,l=files.length;i<l;i++){
						var filePath = files[i];
						var fileName = fileUtils.getFileName(filePath);
						if(fileName.endsWith("tgz")){
							pluginPaths.push(filePath);
						}
					}
					if(pluginPaths.length>0){
						var pluginInstallFunc = (function(plugins){
							return function(){
								try{
									var path = plugins.pop();
									console.log("正在安装插件【"+fileUtils.getFileName(path)+"】，请稍候....");
									childProcess.exec("npm install "+path,function(){
										if(plugins.length>0){
											pluginInstallFunc();
										}else {
											console.log("插件安装完成！");
											fileUtils.removeDirectory(task.pluginsDir);
											task.deferred.resolve();
										}
									});
								}catch(e){
									console.error(e);
									task.deferred.reject();
								}
							}
						})(pluginPaths);
						pluginInstallFunc();
					}
				});
				unzipper.extract({
				    path: unArchivePath
				});
			}catch(e){
				console.error(e);
				task.deferred.reject();
			}
		});
	}
	return this.deferred.promise;
};

SyncTask.prototype.handleError = function(ctx){
	if(this.pluginsDir){
		fileUtils.removeDirectory(this.pluginsDir);
	}
};

SyncTask.prototype.validateConfig = function(){
	var platformCfg = environment.getV3Platform();
	if(!platformCfg){
		console.warn("WARN: package.json文件中没有配置v3Platform属性，同步V3平台插件将终止！");
		this.deferred.reject();
		return false;
	}
	var server = platformCfg.server;
	if(!server){
		console.warn("WARN: package.json文件中v3Platform没有配置V3服务地址[server]，同步V3平台插件将终止！");
		this.deferred.reject();
		return false;
	}
	return true;
};

module.exports = SyncTask;