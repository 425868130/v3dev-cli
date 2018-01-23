var fs = require("fs");
var path = require('path');
var arrayUtils = require("./ArrayUtils");
var pathUtils = require("./PathUtils");

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

var isDirectory = function(path){
	return pathUtils.isDirectory(path);
}

var isFile = function(path){
	return pathUtils.isFile(path);
}

var filte = function(files,subfix){
	var rs = [];
	if(!files) return rs;
	for(var i=0,l=files.length;i<l;i++){
		var path = files[i];
		if(path.endsWith(subfix)){
			rs.push(path);
		}
	}
	return rs;
}

var removeDuplicateDir = function(files){
	var rs = {};
	var temp = [];
	for(var i=0,l=files.length;i<l;i++){
		var path = files[i];
		var arr = _pathToArray(path);
		arr.orginal = path;
		temp.push(arr);
	}
	var parentArray,index=-1;
	for(var i=0,l=temp.length;i<l;i++){
		var array = temp[i];
		if(!parentArray){
			parentArray = array.concat();
			continue;
		}else{
			for(var j=0;j<parentArray.length;j++){
				if(parentArray[j]!=array[j]){
					index = j-1;
					parentArray.length = j;
					break;
				}
			}
		}
	}
	if(temp.length==1){
		var arr = temp[0];
		rs[arr.orginal] = arr.pop();
	}else{
		for(var i=0,l=temp.length;i<l;i++){
			var arr = temp[i];
			rs[arr.orginal] = arr.slice(index+1).join('/');
		}
	}
	return rs;
}

var _pathToArray = function(p){
	var rs = [];
	while(true){
		var basename = path.basename(p);
		if(basename){
			rs.push(basename);
			p = path.resolve(p,"..");
		}else{
			rs.push(p);
			break;
		}
	}
	return rs.reverse();
}

var makeDir = function(filePath){
	var iter = function(parent){
		if(!fs.existsSync(parent)){
			var f = getParentPath(parent);
			iter(f);
			fs.mkdirSync(parent);
		}
	}
	var parent = getParentPath(filePath);
	iter(parent);
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath);
	}
}

var getParentPath = function(filePath){
	return pathUtils.getParentPath(filePath);
}

var getFileName = function(p){
	return path.basename(p);
}

var writeContent = function(absPath,content){
	makeDir(getParentPath(absPath));
	fs.writeFileSync(absPath,content);
}

var removeDirectory = function(dirPath){
	if(isDirectory(dirPath)){
		var fileNames = fs.readdirSync(dirPath);
		if(fileNames&&fileNames.length>0){
			for(var j=0,len=fileNames.length;j<len;j++){
				var absPath = dirPath + "/" + fileNames[j];
				if(isDirectory(absPath)){
					removeDirectory(absPath);
				}else{
					fs.unlinkSync(absPath);
				}
			}
		}
		fs.rmdirSync(dirPath);
	}else{
		throw Error("删除目录失败，原因：指定的路径不是目录！路径："+dirPath);
	}
}

var getV3PluignTempRelativeDir = function(){
	var relativePath = "temp";
	do{
		relativePath +="_";
		var absPath = pathUtils.toPluginPath(relativePath);
	}while(fs.existsSync(absPath));
	return relativePath;
}

var toV3PluginTempRelativePath = function(relativePath){
	return "/"+relativePath+"/plugins.zip";
}


exports.listFiles = listFiles;
exports.isDirectory = isDirectory;
exports.isFile = isFile;
exports.filte = filte;
exports.removeDuplicateDir = removeDuplicateDir;
exports.makeDir = makeDir;
exports.getParentPath = getParentPath;
exports.getFileName = getFileName;
exports.writeContent = writeContent;
exports.removeDirectory = removeDirectory;
exports.getV3PluignTempRelativeDir = getV3PluignTempRelativeDir;
exports.toV3PluginTempRelativePath = toV3PluginTempRelativePath;
/*
var rs = listFiles("D:/Workspaces/nodejs/vplatform-package/dist",true);
for(var i=0,l=rs.length;i<l;i++){
	console.log(rs[i]);
}
console.log(removeDuplicateDir([
	"f:/a/b/c/d/e/f/g/h/i.js"
]));*/
//makeDir("D:/a/b/c/d/e/f/e/h/i.js");
//console.log(getFileName("D:/a/b/c/d/e/f/e/h/i.js"));