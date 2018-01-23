var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var pathUtils = require("../../utils/PathUtils");
var fileUtils = require("../../utils/FileUtils");
var environment = require("../../utils/Environment");
var fs = require("fs");
var Q = require("q");

var PackageJsonTask = function(params){
	this.originalPackageJson = null;
	ITask.call(this,params);
}

objectUtils.extend(PackageJsonTask.prototype,ITask.prototype);

PackageJsonTask.prototype.exe = function(ctx){
	var deferred = Q.defer();
	try{
		var absPath = pathUtils.toPluginPath("package.json");
		if(fs.existsSync(absPath)){
			this.originalPackageJson = fs.readFileSync(absPath);
			var obj = environment.getDealedPackageObj();
			fileUtils.writeContent(absPath,JSON.stringify(obj, null, "\t"));
		}
		deferred.resolve();
	}catch(e){
		console.error(e);
		deferred.reject();
	}
	return deferred.promise;
};

PackageJsonTask.prototype.beforeDone = function(ctx){
	if(this.originalPackageJson){
		var absPath = pathUtils.toPluginPath("package.json");
		fileUtils.writeContent(absPath,this.originalPackageJson);
	}
};

PackageJsonTask.prototype.handleError = function(argument){
	this.exe();
};

module.exports = PackageJsonTask;