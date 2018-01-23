/**
 * 发布构件到Vstore
 */
var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var PluginDeployer = require("../../http/PluginDeployer");
var environment = require("../../utils/Environment");
var Q = require("q");

 var DeployTask = function(params){
 	ITask.call(this,params);
 }

 objectUtils.extend(DeployTask.prototype,ITask.prototype);

 DeployTask.prototype.exe = function(ctx){
 	console.log("开始部署插件到vstore，请稍候...");
 	var deferred = Q.defer();
 	var jar = ctx.get("jar");
 	var deployer = new PluginDeployer({
		"jar":jar.getDist(),
		"source":jar.getSource(),
		"packageJson":environment.getPackageObj(),
		"manifest":jar.getManifest()
	});
	deployer.deploy(function(resp,body){
		console.log("部署到vstore完成！构件名称："+jar.getManifest().getHeader("Bundle-SymbolicName"));
		deferred.resolve();
	},function(err){
		console.error("部署到vstore失败！\n"+err);
		deferred.reject();
	});
	return deferred.promise;
 };

module.exports = DeployTask;