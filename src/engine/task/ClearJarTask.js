var ITask = require("../ITask");
var objectUtils = require("../../utils/ObjectUtils");
var pathUtils = require("../../utils/PathUtils");
var fileUtils = require("../../utils/FileUtils");
var fs = require("fs");
var Q = require("q");

var ClearJarTask = function(params){
	ITask.call(this,params);
}

objectUtils.extend(ClearJarTask.prototype,ITask.prototype);

ClearJarTask.prototype.exe = function(ctx){
	var deferred = Q.defer();
	try{
		var jarPath = pathUtils.getJarAbsPath();
		if(fs.existsSync(jarPath)){
			fs.unlinkSync(jarPath);
		}
		var sourcePath = pathUtils.getSourceJarAbsPath();
		if(fs.existsSync(sourcePath)){
			fs.unlinkSync(sourcePath);
		}
		deferred.resolve();
	}catch(e){
		console.error(e);
		deferred.reject();
	}
	return deferred.promise;
};

ClearJarTask.prototype.handleError = function(ctx){
	this.exe();
};

module.exports = ClearJarTask;