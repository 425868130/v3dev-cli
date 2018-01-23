var archiver = require('archiver');
var Resource = require('./Resource');
var fs = require("fs");
var fileUtils = require("../utils/FileUtils");

var Jar = function(params){
	this.manifest = params.manifest;
	this.resources = params.resources||[];
}

Jar.prototype = {

	appendResource : function(resource){
		this.resources.push(resource);
	},

	persistence : function(absPath,success,err){
		var res = this.resources.concat();
		if(this.manifest){
			var resource = new Resource({
				content:this.manifest.toString(),
				dist:'META-INF/MANIFEST.MF'
			});
			res.push(resource);
		}else{
			throw Error("Jar文件生成失败，原因：没有定义Manifest信息！");
		}
		fileUtils.makeDir(fileUtils.getParentPath(absPath));
		var tempPath = fileUtils.getParentPath(absPath)+"/temp__";
		var output = fs.createWriteStream(absPath);
		var archive = archiver('zip', {
		    zlib: { level: 9 }
		});
		output.on('close', function() {
			fileUtils.removeDirectory(tempPath);
			if(success){
				success(archive);
			}
		});
		if(err){
			archive.on('error', err);
		}
		archive.pipe(output);
		for(var i=0,l=res.length;i<l;i++){
			var resource = res[i];
			var dist = resource.getDist();
			var absPath = tempPath+"/"+dist;
			resource.setDist(absPath);
			resource.persistence();
		}
		archive.directory(tempPath,false);
		archive.finalize();
	}

}

module.exports = Jar;