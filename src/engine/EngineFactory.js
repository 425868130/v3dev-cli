/**
 * 根据命令创建引擎
 */
var Engine = require("./Engine");
var PackageJsonTask = require("./task/PackageJsonTask");
var ClearJarTask = require("./task/ClearJarTask");
var PackageTask = require("./task/PackageTask");
var InstallTask = require("./task/InstallTask");
var DeployTask = require("./task/DeployTask");
var UpdateTask = require("./task/UpdateTask");
var SyncTask = require("./task/SyncTask");

exports.createEngine = function(command){
	var taskList = [];
	switch(command){
		case 'sync'    :
			taskList.push(new SyncTask());
			break; 
		case 'install' :
			taskList.push(new PackageJsonTask());
			taskList.push(new ClearJarTask());
			taskList.push(new PackageTask());
			taskList.push(new InstallTask());
			break;
		case 'deploy'  :
			taskList.push(new PackageJsonTask());
			taskList.push(new ClearJarTask());
			taskList.push(new PackageTask());
			taskList.push(new InstallTask());
			taskList.push(new DeployTask());
			break;
		case 'updateToServer' :
			taskList.push(new PackageJsonTask());
			taskList.push(new ClearJarTask());
			taskList.push(new PackageTask());
			taskList.push(new InstallTask());
			taskList.push(new UpdateTask());
			break;
		default        :
			break;

	}
	return new Engine(taskList);
}