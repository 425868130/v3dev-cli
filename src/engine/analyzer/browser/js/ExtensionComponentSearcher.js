var ExtensionComponentSearcher = function(){

}

ExtensionComponentSearcher._reservedComponent = {};

ExtensionComponentSearcher.searchReservedComponents = function(){
	var components = Vue.options.components;
	for(var name in components){
		ExtensionComponentSearcher._reservedComponent[name] = components[name];
	}
}

ExtensionComponentSearcher.prototype = {

	search : function(){
		var result = {};
		var components = Vue.options.components;
		for(var name in components){
			if(!ExtensionComponentSearcher._reservedComponent[name]){
				var def = new ComponentDefine(components[name]);
				var rs = def.parse();
				if(rs){
					result[name] = rs;
				}
			}
		}
		return result;
	}

}

ExtensionComponentSearcher.searchReservedComponents();