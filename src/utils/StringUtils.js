var crypto = require("crypto");
var md5 = crypto.createHash('md5');
var constant = require("./Constant");
var environment = require("./Environment");

exports.toMd5 = function(str){
	return md5.update(str).digest('hex');
}

exports.toBase64 = function(str){
	var b = new Buffer(str);
	return b.toString('base64');
}

exports.toArtifactId = function(name){
	return constant.ARTIFACT_PREFIX+ environment.getPluginType() + '.' + name;
}

exports.toSymbolicName = function(name){
	return constant.DEFAULT_GROUP_ID + "-" + exports.toArtifactId(name);
}

exports.toTagResourceVjsName = function(tagName){
	return constant.ARTIFACT_PREFIX+environment.getPluginType()+'.'+tagName;
}

exports.toMavenVersion = function(version){
	return version.endsWith("SNAPSHOT") ? version:version+".SNAPSHOT";
}

exports.isEmpty = function(str){
	return typeof(str)=="undefined"||str===null;
}

exports.toModuleId = function(vjsName,moduleName,version){
	var buff = [];
	var c = exports.toHashCode(vjsName);
	buff.push(c>=0 ? c:"_"+Math.abs(c));
	buff.push("/");
	c = exports.toHashCode(moduleName);
	buff.push(c>=0 ? c:"_"+Math.abs(c));
	buff.push("_");
	var v = version.split(".");
	var subfix = v.pop();
	buff = buff.concat(v);
	buff.push("SNAPSHOT"==subfix ? "S":subfix);
	return buff.join("");
}

exports.toHashCode = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}