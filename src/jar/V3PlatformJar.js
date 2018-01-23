var Jar = require("./Jar");
var FileResource = require("./FileResource");
var pathUtils = require("../utils/PathUtils");
var V3PluginFileResource = require("./V3PluginFileResource");
var xml2js = require("xml2js");
var Resource = require("./Resource");
var FileResource = require("./FileResource");
var Instance = require("./Instance");
var Mainfest = require('./V3PlatformManifest');
var fileUtils = require("../utils/FileUtils");
var constant = require("../utils/Constant");
var stringUtils = require("../utils/StringUtils");
var Vjs = require("../vjs/Vjs");
var Module = require("../vjs/Module");
var VjsToXml = require("../vjs/VjsToXml");
var Service = require("../vjs/Service");
var Dependency = require("../vjs/Dependency");

var V3PlatformJar = function(params){
	this.tarballPath = params.tarballPath;
	this.sourceExclude = ["node_modules"];
	this.packageJson = params.packageJson;
	this.libs = params.libs;
	this.components = params.components;
	this.dependencies = params.dependencies;
	this.dist = null;
	this.sourceDist = null;
	this.manifest = null;
	this.jar = null;
	this.sourceJar = null;
	this._init();
}

V3PlatformJar.prototype = {

	_createTagVjs : function(componentNames,pagePaths){
		var vjsList = [];
		var platformCfg = this.packageJson.v3Platform;
		var componentDefines = platformCfg.componentDefines;
		for(var i=0,l=componentNames.length;i<l;i++){
			var name = componentNames[i];
			var factoryBuff = [];
			factoryBuff.push("function(require,exports,module){");
			factoryBuff.push("exports.initModule=function(sb){");
			factoryBuff.push("var windowResource=sb.getService(\"vjs.framework.extension.platform.services.view.window.resources.WindowResource\");");
			factoryBuff.push("var Resource=sb.getService(\"vjs.framework.extension.platform.services.view.window.resources.Resource\");");
			factoryBuff.push("windowResource.addResource(new Resource({\"resources\":");
			factoryBuff.push(JSON.stringify(pagePaths));
			if(componentDefines&&componentDefines[name]){
				var define = componentDefines[name];
				var obj = {
					componentName:name,
					dataProp:define.dataProp,
					dataType:define.dataType,
					treeStructProp:define.treeStructProp
				}
				factoryBuff.push(",\"success\":function(){window._$V3Vue.registerComponent(");
				factoryBuff.push(JSON.stringify(obj));
				factoryBuff.push(");}");
			}
			factoryBuff.push("}));");
			factoryBuff.push("}}");
			var modules = [new Module({
				id:stringUtils.toModuleId(stringUtils.toTagResourceVjsName(name),"./Resource",stringUtils.toMavenVersion(this.packageJson.version)),
				name:"./Resource",
				factory:factoryBuff.join("")
			})];
			var vjs = new Vjs({
				name:stringUtils.toTagResourceVjsName(name),
				version:stringUtils.toMavenVersion(this.packageJson.version),
				dependencies:[
					new Dependency({
						name:"vjs.framework.extension.platform.services.view.window.resources",
						version:null
					})
				],
				services:[
					new Service({
						name:stringUtils.toTagResourceVjsName(name)+".Resources",
						module:modules[0]
					})
				],
				modules:modules
			});
			vjsList.push(vjs);
		}
		return vjsList;
	},

	_init : function(){
		var resources = [];
		var dealLibs = fileUtils.removeDuplicateDir(this.libs),distLibs=[],pagePaths=[];
		for(var i=0,l=this.libs.length;i<l;i++){
			var libPath = this.libs[i];
			var file = new V3PluginFileResource({
				name:this.packageJson.name,
				source:libPath,
				dist:dealLibs[libPath]
			});
			var dist = file.getDist();
			distLibs.push(dist);
			pagePaths.push(dist.substring(15));
			resources.push(file);
		}
		var xmlDefine = {};
		xmlDefine.components = this.components;
		xmlDefine.dependencies = this.dependencies;
		xmlDefine.sources = {};
		xmlDefine.sources.lib = distLibs;
		var builder = new xml2js.Builder();
		var xml = builder.buildObject(xmlDefine);
		var xmlResource = new Resource({
			content:xml,
			dist:constant.PLUGIN_METADATA_NAME
		});
		resources.push(xmlResource);
		var componentNames = [];
		if(this.components){
			for(var name in this.components){
				componentNames.push(name);
			}
		}
		var vjsList = this._createTagVjs(componentNames,pagePaths);
		var vjsNames = [];
		for(var i=0,l=vjsList.length;i<l;i++){
			var vjs = vjsList[i];
			vjsNames.push(vjs.getName());
		}
		var vjsXml = new VjsToXml({
			vjsList:vjsList
		});
		var xmlStr = vjsXml.toXML();
		resources.push(new Resource({
			content:xmlStr,
			dist:"vjs/package/manager/vjsDefineXml-dev.xml"
		}));
		resources.push(new Resource({
			content:xmlStr,
			dist:"vjs/package/manager/vjsDefineXml-prd.xml"
		}));
		resources.push(new FileResource({
			source:this.tarballPath,
			dist:pathUtils.toPluginTGZSettingPath(fileUtils.getFileName(this.tarballPath))
		}));
		var componentDefines = [];
		var platformCfg = this.packageJson.v3Platform;
		var defines = platformCfg.componentDefines;
		if(defines){
			for(var name in defines){
				var define = defines[name];
				componentDefines.push({
					componentName:name,
					dataProp:define.dataProp,
					dataType:define.dataType,
					treeStructProp:define.treeStructProp
				});
			}
		}
		var instance = new Instance({
			component:"widget.extension",
			properties:{
				symbolicName:stringUtils.toArtifactId(this.packageJson.name),
				vjsNames:vjsNames,
				resources:pagePaths,
				dependencies:this.dependencies,
				componentDefines:componentDefines
			}
		});
		this.manifest = new Mainfest({
			packageJson:this.packageJson,
			instances:[instance]
		});
		this.jar = new Jar({
			manifest:this.manifest,
			resources:resources
		});
		this.sourceJar = new Jar({
			manifest:this.manifest,
			resources:this._getSourceFiles()
		});
		var outDir = this._getOutDir();
		var version = this.manifest.getHeader("Bundle-Version");
		version = version.replace(".SNAPSHOT","-SNAPSHOT");
		this.dist = pathUtils.getJarAbsPath();
		this.sourceDist = pathUtils.getSourceJarAbsPath();
	},
	//获取jar输出目录
	_getOutDir : function(){
		var platformCfg = this.packageJson.v3Platform;
		return platformCfg.out ? platformCfg.out:constant.DEFAULT_PLUGIN_DIR;
	},

	//获取源码资源
	_getSourceFiles : function(){
		var dir = pathUtils.getPluginPath();
		var excludes = this.sourceExclude.concat();
		excludes.push(this._getOutDir());
		for(var i=0,l=excludes.length;i<l;i++){
			excludes[i] = pathUtils.toPluginPath(excludes[i]);
		}
		var files = fileUtils.listFiles(dir,true,excludes);
		var resources = [];
		for(var i=0,l=files.length;i<l;i++){
			var file = files[i];
			if(fileUtils.isFile(file)){
				var dist = file.substring(dir.length+1);
				var resource;
				if("package.json"==dist){
					var platformCfg = this.packageJson.v3Platform;
					if(platformCfg){
						platformCfg.account = null;
						platformCfg.pwd = null;
					}
					resource = new Resource({
						content:JSON.stringify(this.packageJson, null, "\t"),
						dist:dist
					});
				}else{
					resource = new FileResource({
						source:file,
						dist:dist
					});
				}
				resources.push(resource);
			}
		}
		return resources;
	},

	persistence : function(callback){
		var _jar = this;
		this.jar.persistence(this.dist,function(archive){
			_jar.sourceJar.persistence(_jar.sourceDist,function(){
				if(callback){
					callback(archive);
				}
			},function(err){
				console.error('ERROR: v3平台扩展插件打包失败！原因：'+err.message);
		  		throw err;
			});
		},function(err) {
		  console.error('ERROR: v3平台扩展插件打包失败！原因：'+err.message);
		  throw err;
		});
	},

	getDist : function(){
		return this.dist;
	},

	getSource : function(){
		return this.sourceDist;
	},

	getManifest : function(){
		return this.manifest;
	},

	getJar : function(){
		return this.jar;
	}

};

module.exports = V3PlatformJar;