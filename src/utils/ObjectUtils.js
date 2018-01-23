exports.isArray = function(a){
	return "[object Array]" == Object.prototype.toString.call(a);
};

exports.isFunction = function(obj){
	return typeof(obj) == "function";
};

exports.isObject = function(o){
	return o === Object(o);
};

exports.clone =function(object){
	var json = JSON.stringify(object);
	return JSON.parse(json);
}

exports.extend = function(aimFn,sourceFn){
	var pp = aimFn.prototype;
	if(!pp){
		pp = {};
		aimFn.prototype = pp;
	}
	var spp = sourceFn.prototype;
	if(spp){
		for(var name in spp){
			pp[name] = spp[name];
		}
	}
}