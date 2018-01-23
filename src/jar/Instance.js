var objectUtils = require("../utils/ObjectUtils");

var Instance = function(params){
	this.component = params.component;
	this.properties = params.properties;
}

Instance.prototype = {

	setProperty : function(name,val){
		var pros = this.properties;
		if(!pros){
			pros = {};
			this.properties = pros;
		}
		pros[name] = val;
	},

	_toArrayValStr : function(val){
		var buff = [];
		for(var i=0,l=val.length;i<l;i++){
			var item = val[i];
			buff.push("property { ")
			buff.push(this._toValStr(item));
			buff.push("}");
		}
		return buff.join("");
	},

	_toMapValStr : function(val){
		var buff = [];
		for(var name in val){
			var keyVal = val[name];
			buff.push("property { ");
			buff.push("$name=\"");
			buff.push(name);
			buff.push("\" ");
			buff.push(this._toValStr(keyVal));
			buff.push("}");
		}
		return buff.join("");
	},

	_toStrValStr : function(val){
		var buff = [];
		buff.push("$value=\"");
		var json = JSON.stringify([val]);
		var valStr = json.substring(2, json.length-2);
		buff.push(valStr);
		buff.push("\" ");
		return buff.join("");
	},

	_toValStr : function(val){
		var buff = [];
		if(objectUtils.isArray(val)){
			buff.push("$type=\"list\" ");
			buff.push(this._toArrayValStr(val));
		}else if(objectUtils.isObject(val)){
			buff.push("$type=\"map\" ");
			buff.push(this._toMapValStr(val));
		}else{
			buff.push(this._toStrValStr(val));
		}
		return buff.join("");
	},

	_toValueStr : function(key,val){
		var buff = [];
		buff.push("property { $name=\"");
		buff.push(key);
		buff.push("\" ");
		buff.push(this._toValStr(val));
		buff.push("}");
		return buff.join("");
	},

	toString : function(){
		var buff = ["instance { $component=\""];
		buff.push(this.component);
		buff.push("\" ");
		if(this.properties){
			for(var attr in this.properties){
				var val = this.properties[attr];
				buff.push(this._toValueStr(attr,val));
			}
		}
		buff.push("}");
		return buff.join("");
	}

}

module.exports = Instance;
/*
var i = new Instance({
	component:"widget.extension",
	properties:{
		symbolicName:"vjs.framework.extension.platform.custom.widget.element-tree",
		vjsNames:["vjs.framework.extension.platform.custom.widget.vuiTreeExtra"],
		resources:["itop/common/extension/custom/widget/element-tree/tree.min.js"],
		componentDefines:[
			{
				componentName:"vuiSwiper",
				dataProp:"data",
				dataType:"Tree"
			}
		]
	}
});
console.log(i.toString());*/