var Module = function(params){
	this.id = params.id;
	this.name = params.name;
	this.factory = params.factory;
}

Module.prototype = {

	setId : function(id){
		this.id = id;
	},

	getId : function(){
		return this.id;
	},

	setName : function(name){
		this.name = name;
	},

	getName : function(){
		return this.name;
	},

	setFactory : function(factory){
		this.factory = factory;
	},

	getFactory : function(){
		return this.factory;
	},

	toXmlObj : function(){
		var module = {};
		var script = {};
		module.script = script;
		script.id = this.id;
		script.factory = this.factory;
		return module;
	}

}

module.exports = Module;