var Vjs = function(params){
	this.name = params.name;
	this.version = params.version;
	this.dependencies = params.dependencies;
	this.services = params.services;
	this.modules = params.modules;
}

Vjs.prototype = {

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

	setDependencies : function(dependencies){
		this.dependencies = dependencies;
	},

	getDependencies : function(){
		return this.dependencies;
	},

	setServices : function(services){
		this.services = services;
	},

	getServices : function(){
		return this.services;
	},

	setModules : function(modules){
		this.modules = modules;
	},

	getModules : function(){
		return this.modules;
	},

	toXmlObj : function(){
		var obj = {};
		var define = {};
		obj.define = define;
		define.name = this.name;
		define.version = this.version;
		var deps = [];
		define.deps = {dep:deps};
		if(this.dependencies&&this.dependencies.length>0){
			for(var i=0,l=this.dependencies.length;i<l;i++){
				var dep = this.dependencies[i];
				deps.push(dep.toXmlObj());
			}
		}
		var services = [];
		define.services = {service:services};
		if(this.services&&this.services.length>0){
			for(var i=0,l=this.services.length;i<l;i++){
				var service = this.services[i];
				services.push(service.toXmlObj());
			}
		}
		var children = [];
		obj.children = {child:children};
		if(this.modules){
			for(var i=0,l=this.modules.length;i<l;i++){
				var module = this.modules[i];
				children.push(module.toXmlObj());
			}
		}
		return obj;
	}

}

module.exports = Vjs;