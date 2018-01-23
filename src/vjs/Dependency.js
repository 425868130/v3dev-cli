var Dependency = function(params){
	this.name = params.name;
	this.version = params.version;
}

Dependency.prototype = {

	setName : function(name){
		this.name = name;
	},

	getName : function(){
		return this.name;
	},

	setVersion : function(version){
		this.version = version;
	},

	getVersion : function(){
		return this.version;
	},

	toXmlObj : function(){
		var obj = {};
		obj.$ = {};
		obj.$.name = this.name;
		if(this.version){
			obj.$.version = this.version;
		}
		return obj;
	}
}

module.exports = Dependency;
