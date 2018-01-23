/**
 * 将插件更新到服务器
 */
var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var environment = require("../../utils/Environment");
var PluginUpdater = require("../../http/PluginUpdater")
var Q = require("q");

var UpdateTask = function(params){
	ITask.call(this,params);
}

objectUtils.extend(UpdateTask.prototype,ITask.prototype);

UpdateTask.prototype.exe = function(ctx){
	var deferred = Q.defer();
	var jar = ctx.get("jar");
	var updater = new PluginUpdater({
		"jar":jar.getDist(),
		"packageJson":environment.getPackageObj(),
		"manifest":jar.getManifest()
	});
	console.log("开始更新插件到服务器:"+updater.getServer()+",请稍候...");
	updater.update(function(){
		console.log("更新插件到服务器完成！构件名称："+jar.getManifest().getHeader("Bundle-SymbolicName"));
		deferred.resolve();
	},function(err){
		console.error("更新插件到服务器失败！\n"+err);
		deferred.reject();
	});
	return deferred.promise;
};

module.exports = UpdateTask;