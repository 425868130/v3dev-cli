var fs = require("fs");
var objectUtils = require("./ObjectUtils");
var pathUtil = require('path');
var environment = require("./Environment");
var constant = require("./Constant");
var stringUtils = require("./StringUtils");

var getPluginPath = function(){
	return fs.realpathSync('.');
}

var toPluginPath = function(path){
	return getPluginPath() +'/'+path;
}

var isDirectory = function(path){
	if(fs.existsSync(path)){
		var stat = fs.statSync(path);
		return stat.isDirectory();
	}
	return false;
}

var isFile = function(path){
	if(fs.existsSync(path)){
		var stat = fs.statSync(path);
		return stat.isFile();
	}
	return false;
}

var getParentPath = function(path){
	return pathUtil.resolve(path,"..");
}

var matchPaths = {
	"bin":true,
	"bundle":{
		"drivers":true,
		"extensions":{
			"dropins":true,
			"vplatform":true
		},
		"system":true
	},
	"cache":true,
	"conf":{
		"setting":true
	},
	"pages":true
}

var listFileNames = function(path){
	if(isDirectory(path)){
		var fileNames = fs.readdirSync(path);
		if(fileNames&&fileNames.length>0){
			return fileNames;
		}
	}
	return [];
}

var contains = function(source,compare){
	var founded = true;
	for(var i=0,l=compare.length;i<l;i++){
		var index = source.indexOf(compare[i]);
		if(index==-1){
			founded = false;
			break;
		}
	}
	return founded;
}

var listKeys = function(obj){
	var keys = [];
	for(var attr in obj){
		keys.push(attr);
	}
	return keys;
}

var isMatchPath = function(path,matcher){
	matcher = matcher||matchPaths;
	var names = listFileNames(path);
	var keys = listKeys(matcher);
	var result = true;
	if(contains(names,keys)){
		for(var key in matcher){
			var val = matcher[key];
			if(objectUtils.isObject(val)){
				result = result&&isMatchPath(path+"/"+key,val);
			}
		}
	}else{
		result = false;
	}
	return result;
}

//获取执行系统根目录
var getRuntimeDir = function(){
	var path = getPluginPath();
	while(true){
		if(!isMatchPath(path,null)){
			var path1 = getParentPath(path);
			if(path1!=path){
				path = path1;
			}else{
				path = null;
				break;
			}
		}else{
			break;
		}
	}
	return path;
}

var getV3PluignTempRelativeDir = function(){
	var relativePath = "temp";
	do{
		relativePath +="_";
		var absPath = toPluginPath(relativePath);
	}while(fs.existsSync(absPath));
	return relativePath;
}

var getV3PluginTGZDir = function(){
	var path = environment.getPluginTempPath();
	return path + '/' + constant.SETTING_PLUGIN_TGZ_DIR + environment.getPluginName();
}

var getFileName = function(p){
	return pathUtil.basename(p);
}

var getPluginTGzPath = function(packageJsonObj){
	var name = packageJsonObj.name;
	var pluginPath = getPluginPath();
	var filePaths = listFiles(pluginPath,false,null);
	var result = [];
	if(filePaths&&filePaths.length>0){
		for(var i=0,l=filePaths.length;i<l;i++){
			var filePath = filePaths[i];
			var fileName = getFileName(filePath);
			if(fileName.startsWith(name)&&fileName.endsWith(".tgz")){
				result.push(filePath);
			}
		}
	}
	return result;
}

var listFiles = function(dirPath,recursion,excludes){
	recursion = typeof(recursion)=='boolean' ? recursion:false;
	if(!fs.existsSync(dirPath)){
		throw Error("文件路径不存在，请检查！path="+dirPath);
	}
	var absPaths = [];
	if(isDirectory(dirPath)){
		var fileNames = fs.readdirSync(dirPath);
		if(fileNames&&fileNames.length>0){
			for(var j=0,len=fileNames.length;j<len;j++){
				var absPath = dirPath + "/" + fileNames[j];
				if(!excludes||!arrayUtils.contains(excludes,absPath)){
					absPaths.push(absPath);
					if(recursion){
						if(isDirectory(absPath)){
							absPaths = absPaths.concat(listFiles(absPath,recursion,excludes));
						}
					}
				}
			}
		}
	}else{
		throw Error("路径错误，不是文件夹！path="+dirPath);
	}
	return absPaths;
}

var toPluginPagePath = function(path){
	return constant.PAGE_RESOURCE_DIR + environment.getPluginType() + '/' + environment.getPluginName() + '/' + path;
}

var toPluginTGZSettingPath = function(path){
	return constant.SETTING_PLUGIN_TGZ_DIR + environment.getPluginType() + '/' + path;
}

var _getJarDir = function(){
	var platformCfg = environment.getV3Platform();
	var out = platformCfg.out ? platformCfg.out:constant.DEFAULT_PLUGIN_DIR;
	return toPluginPath(out);
}

var getJarAbsPath = function(){
	var packageJsonObj = environment.getPackageObj();
	return _getJarDir() + '/' + stringUtils.toSymbolicName(packageJsonObj.name) +'-'+packageJsonObj.version+'.jar';
}

var getSourceJarAbsPath = function(){
	var packageJsonObj = environment.getPackageObj();
	return _getJarDir() + '/' + stringUtils.toSymbolicName(packageJsonObj.name) +'-'+packageJsonObj.version+'-sources.jar';
}

exports.getPluginPath = getPluginPath;
exports.toPluginPath = toPluginPath;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.getParentPath = getParentPath;
exports.getRuntimeDir = getRuntimeDir;
exports.getV3PluignTempRelativeDir = getV3PluignTempRelativeDir;
exports.getPluginTGzPath = getPluginTGzPath;
exports.getV3PluginTGZDir = getV3PluginTGZDir;
exports.listFiles = listFiles;
exports.toPluginPagePath = toPluginPagePath;
exports.toPluginTGZSettingPath = toPluginTGZSettingPath;
exports.getJarAbsPath = getJarAbsPath;
exports.getSourceJarAbsPath = getSourceJarAbsPath;