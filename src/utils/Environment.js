var objectUtils = require("./ObjectUtils");

var Environment = function(){
	this.packageObj = null;
	this.tgzPath = null;
	this.account = null;
	this.pwd = null;
	this.pluginTempDir = null;
}

Environment.prototype = {

	getPackageObj : function(){
		return this.packageObj;
	},

	setPackageObj : function(packageObj){
		this.packageObj = objectUtils.clone(packageObj);
		var v3Platform = this.getV3Platform();
		if(v3Platform){
			this.account = v3Platform.account;
			this.pwd = v3Platform.pwd;
		}
	},

	//获取处理过的信息：删除用户名，密码信息
	getDealedPackageObj : function(){
		var v3Platform = this.packageObj.v3Platform;
		if(v3Platform){
			v3Platform.account = null;
			v3Platform.pwd = null;
		}
		return this.packageObj;
	},

	//获取插件临时存放目录
	getPluginTempDir : function(){
		return this.pluginTempDir;
	},

	//设置插件临时存放目录
	setPluginTempDir : function(path){
		return this.pluginTempDir = path;
	},

	//获取插件类型
	getPluginType : function(){
		var type;
		var v3Platform = this.getV3Platform();
		if(v3Platform){
			type = v3Platform.type;
		}
		return type ? type:"widget";
	},

	getPluginName : function(){
		return this.packageObj.name;
	},

	getV3Platform : function(){
		return this.packageObj.v3Platform;
	},

	setTGZPath : function(tgzPath){
		this.tgzPath = tgzPath;
	},

	getTGZPath : function(){
		return this.tgzPath;
	},

	getAccount : function(){
		return this.account;
	},

	getPwd : function(){
		return this.pwd;
	}
}

module.exports = new Environment();