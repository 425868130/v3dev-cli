var ComponentDefine = function(define){
	this.define = define;
}

ComponentDefine.prototype = {

	parse : function(){
		var result = {};
		var options = this.define.options;
		if(!options)return null;
		var components = options.components;
		return {
			props:this._parseProps()
		};
	},

	_getOptions : function(){
		return this.define.options;
	},

	_parseProps : function(){
		var options = this._getOptions();
		var props = options.props;
		var args = [];
		for(var prop in props){
			var result = this._parseProp(props[prop]);
			result.name = prop;
			args.push(result);
		}
		return args;
	},

	_parseProp : function(prop){
		var type = prop.type;
		if(!this._isArray(type)&&type){
			type = [type];
		}else{
			type = [];
		}
		var types = [];
		for(var i=0,l=type.length;i<l;i++){
			var tp = type[i];
			var rs = tp();
			if(this._isArray(rs)){
				types.push("array");
			}else if(this._isObject(rs)){
				types.push("object");
			}else if(this._isFunction(rs)){
				types.push("function");
			}else{
				types.push(typeof(rs));
			}
		}
		var result = {
			type:types,
			required:!!prop.required
		};
		if(prop.hasOwnProperty("default")){
			var def = prop.default;
			if(this._isFunction(def)){
				try{
					result.default = def();
				}catch(e){}
			}else{
				result.default = prop.default;
			}
		}
		return result;
	},

	_isArray : function(a){
		return "[object Array]" == Object.prototype.toString.call(a);
	},

	_isFunction : function(obj){
		return typeof(obj) == "function";
	},

	_isObject : function(o){
		return o === Object(o);
	}

}