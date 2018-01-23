var Resource = require("./Resource");
var objectUtils = require("../utils/ObjectUtils");
var fileUtils = require("../utils/FileUtils");
var fs = require("fs");

var FileResource = function(params){
	this.source = params.source;
	Resource.call(this,params);
}

objectUtils.extend(FileResource,Resource);

FileResource.prototype.getContent = function(){
	return fs.readFileSync(this.source, "utf-8");
};

FileResource.prototype.persistence = function(){
	fileUtils.makeDir(fileUtils.getParentPath(this.dist));
	fs.writeFileSync(this.dist, fs.readFileSync(this.source));
};

module.exports = FileResource;
