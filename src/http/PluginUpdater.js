var needle = require("needle");
var fileUtils = require("../utils/FileUtils");
var stringUtils = require("../utils/StringUtils");
var Constant  = require("../utils/Constant");
var environment = require("../utils/Environment");
var fs = require("fs");

var PluginUpdater = function(params){
	this.jar = params.jar;
	this.manifest = params.manifest;
	this.packageJson = params.packageJson;
}

PluginUpdater.prototype = {

	update : function(successCb,errCb){
		var account = this.getAccount(),pwd = this.getPwd();
		if(stringUtils.isEmpty(account)||stringUtils.isEmpty(pwd)){
			console.error("更新插件到服务失败！原因：没有配置账户或密码信息！");
		}else{
			var params = {
				"command":"updateBundleToDebug",
				"symbolicName":this.manifest.getHeader("Bundle-SymbolicName"),
				"fileName":fileUtils.getFileName(this.jar)
			};
			params[fileUtils.getFileName(this.jar)] = fs.readFileSync(this.jar);
			var basicUsernameAndPwd = account + ":" + pwd;
			needle.post(this.getUpdateUrl(), params, {
				timeout:180000,
				multipart: true,
				headers:{
					"Authorization" : "Basic "+ stringUtils.toBase64(basicUsernameAndPwd)
				}
			}, function(err, resp, body) {
				if(err&&errCb){
					errCb(err);
				}else if(successCb){
					successCb(resp,body);
				}
			});
		}
	},

	getAccount : function(){
		var account = environment.getAccount();
		var v3Cfg = environment.getV3Platform();
		var server = v3Cfg.server;
		return server&&server.account ? server.account:account;
	},

	getPwd : function(){
		var pwd = environment.getPwd();
		var v3Cfg = environment.getV3Platform();
		var server = v3Cfg.server;
		return server&&server.pwd ? server.pwd:pwd;
	},

	getServer : function(){
		var v3Cfg = environment.getV3Platform();
		var server = v3Cfg.server;
		if(!server){
			return null;
		}
		if(typeof(server)=="string"){
			return server;
		}else{
			return server.url;
		}
	},

	getUpdateUrl : function(){
		var server = this.getServer();
		if(stringUtils.isEmpty(server)){
			console.error("更新插件到服务失败！原因：没有配置服务器地址！");
		}else{
			var servlet = Constant.BUNDLE_UPDATE_SERVLET;
			if (server.endsWith('/')&&servlet.startsWith('/')) {
				servlet = servlet.substring(1);
			}
			return server + servlet;
		}
	}

}

module.exports = PluginUpdater;