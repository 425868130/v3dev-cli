var Manifest = require('./Manifest');
var objectUtils = require("../utils/ObjectUtils");
var stringUtils = require("../utils/StringUtils");
var os = require("os");
var constant = require("../utils/Constant");
var prefix = constant.DEFAULT_GROUP_ID + "-" + constant.ARTIFACT_PREFIX;

var V3PlatformManifest = function(params){
	this.packageJson = params.packageJson;
	this.name = params.name||this.packageJson.name;
	this.version = params.version||this.packageJson.version;
	this.instances = params.instances;
	Manifest.call(this,params.headers);
	this._init();
}

objectUtils.extend(V3PlatformManifest,Manifest)

V3PlatformManifest.prototype._init = function(){
	this.setHeader("Bundle-Name",this.name);
	this.setHeader("Bundle-SymbolicName",stringUtils.toSymbolicName(this.name));
	this.setHeader("Bundle-Version",stringUtils.toMavenVersion(this.version));
	this.setHeader("Manifest-Version","1.0");
	this.setHeader("Built-By",os.userInfo().username);
	this.setHeader("Bnd-LastModified",(new Date()).getTime()+'');
	this.setHeader("Created-By","Nodejs Plugin & vplatform-package 1.0.0");
	this.setHeader("Bundle-ManifestVersion","2");
	this.setHeader("MatchCode","CustomPlugins."+this.name);
	this.setHeader("MatchVersion",this.getMatchVersion());
	this.setHeader("MinMatchVersion",this.getMinMatchVersion());
	this.setHeader("VJS-Package",'[{"BundleName":null,"Builder":{"configs":{"test":"vjs/package/manager/vjsDefineXml-dev.xml","dev":"vjs/package/manager/vjsDefineXml-dev.xml","prd":"vjs/package/manager/vjsDefineXml-prd.xml"},"builderName":"vjs.builder.implementation.runtime.xmlparser"},"Dependencies":{},"Provides":[]}]');
	if(this.instances&&this.instances.length>0){
		var buff = [];
		for(var i=0,l=this.instances.length;i<l;i++){
			var instance = this.instances[i];
			//instance.setProperty("symbolicName",this.getHeader("Bundle-SymbolicName"));
			buff.push(instance.toString());
		}
		this.setHeader("iPOJO-Components",buff.join(""));
	}
};

V3PlatformManifest.prototype.getMatchVersion = function(){
	var v3Cfg = this.packageJson.v3Platform;
	return v3Cfg.matchVersion ? v3Cfg.matchVersion:1;
}

V3PlatformManifest.prototype.getMinMatchVersion = function(){
	var v3Cfg = this.packageJson.v3Platform;
	return v3Cfg.minMatchVersion ? v3Cfg.minMatchVersion:1;
}

module.exports = V3PlatformManifest;