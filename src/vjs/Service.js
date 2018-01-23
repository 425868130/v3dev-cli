var Service = function(params){
	this.name = params.name;
	this.module = params.module;
	this.pros = params.pros;
}

Service.prototype = {

	setName : function(name){
		this.name = name;
	},

	getName : function(){
		return this.name;
	},

	setModule : function(module){
		this.module = module;
	},

	getModule : function(){
		return this.module;
	},

	setPros : function(pros){
		this.pros = pros;
	},

	getPros : function(){
		return this.pros;
	},

	toXmlObj : function(){
		var service = {};
		service.$ = {};
		service.$.name = this.name;
		service.$.id = this.module.getId();
		service.$.implements = this.module.getName();
		if(this.pros){
			var pros = JSON.stringify(this.pros)
			service.pros = pros;
		}

		return service;
	}

}

module.exports = Service;