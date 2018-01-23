var needle = require("needle");
var constant = require("../utils/Constant");
var stringUtils = require("../utils/StringUtils");
var fileUtils = require("../utils/FileUtils");
var environment = require("../utils/Environment");
var fs = require("fs");

var PluginDeployer = function(params){
	this.jar = params.jar;
	this.packageJson = params.packageJson;
	this.source = params.source;
	this.manifest = params.manifest;
}

PluginDeployer.prototype = {

	deploy : function(successCb,errCb){
		var v3Platform = this.packageJson.v3Platform;
		var account = environment.getAccount(),pwd = environment.getPwd();
		if(stringUtils.isEmpty(account)||stringUtils.isEmpty(pwd)){
			console.error("部署插件到VStore失败！原因：没有配置账户或密码信息！");
		}else{
			var params = {
				"data" : {
					"groupId":constant.DEFAULT_GROUP_ID,
					"artifactId":stringUtils.toArtifactId(this.packageJson.name),
					"version":this.manifest.getHeader("Bundle-Version"),
					"symbolic-name":this.manifest.getHeader("Bundle-SymbolicName"),
					"bundle-name":this.packageJson.name,
					"type":"RuntimeJava",
					"import-package":"",
					"export-package":"",
					"lastModified":this.manifest.getHeader("Bnd-LastModified"),
					"description":this.packageJson.description,
					"owner":account,
					"password":stringUtils.toMd5(pwd),
					"provider":account,
					"partLibCode":v3Platform.libType ? v3Platform.libType:"dev"
				}
			};
			var json = JSON.stringify(params);
			var encodedJson = encodeURIComponent(json);
			var data = {
				token : encodedJson,
				ajaxRequest : true
			};
			data[fileUtils.getFileName(this.jar)] = fs.readFileSync(this.jar);
			data[fileUtils.getFileName(this.source)] = fs.readFileSync(this.source);
			needle.post(constant.DEPLOY_URL, data, {
				timeout:180000,
				multipart: true 
			}, function(err, resp, body) {
				if(err&&errCb){
					errCb(err);
				}else if(successCb){
					successCb(resp,body);
				}
			});
		}
	}

}

module.exports = PluginDeployer;