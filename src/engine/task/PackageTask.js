/**
 * 打包nodejs插件
 */
 var ITask = require("../ITask");
 var objectUtils = require("../../utils/ObjectUtils");
 var childProcess = require('child_process');
 var environment = require("../../utils/Environment");
 var pathUtils = require("../../utils/PathUtils");
 var fileUtils = require("../../utils/FileUtils");
 var fs = require("fs");
 var Q = require("q");

 var PackageTask = function(params){
 	ITask.call(this,params);
 }

 objectUtils.extend(PackageTask.prototype,ITask.prototype);

PackageTask.prototype.exe = function(){
	var deferred = Q.defer();
	childProcess.exec("npm pack",function(){
		var tgzPaths = pathUtils.getPluginTGzPath(environment.getPackageObj());
		var tgzPath = tgzPaths[0];
		environment.setTGZPath(tgzPath);
		deferred.resolve();
	});
	return deferred.promise;
};

PackageTask.prototype.handleError = function(){
	var tgzPaths = pathUtils.getPluginTGzPath(environment.getPackageObj());
	if(tgzPaths.length>0){
		var tgzPath = tgzPaths[0];
		fs.unlinkSync(tgzPath);
	}
};

module.exports = PackageTask;