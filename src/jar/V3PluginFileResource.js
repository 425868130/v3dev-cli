var FileResource = require("./FileResource");
var objectUtils = require("../utils/ObjectUtils");
var pathUtils = require("../utils/PathUtils");

/**
 *
 */
var V3PluginFileResource = function(params){
	var source = params.source;
	var dist = params.dist;
	var args = {
		source:source,
		dist: pathUtils.toPluginPagePath(dist)
	};
	FileResource.call(this,args);
}

objectUtils.extend(V3PluginFileResource,FileResource);

module.exports = V3PluginFileResource;