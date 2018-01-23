var fileUtils = require("../utils/FileUtils");

var Resource = function(params){
	this.content = params.content;
	this.dist = params.dist;
}

Resource.prototype = {

	getContent : function(){
		return this.content;
	},

	getDist : function(){
		return this.dist;
	},

	setDist : function(dist){
		this.dist = dist;
	},

	persistence : function(){
		fileUtils.writeContent(this.dist,this.getContent());
	}

}

module.exports = Resource;