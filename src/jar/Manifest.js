
function Manifest(params){
	this.headers = params||{};
}

Manifest.prototype = {

	getHeader : function(name){
		return this.headers[name];
	},

	setHeader : function(name,val){
		this.headers[name] = val;
	},

	toString : function(){
		var buff = [];
		for(var name in this.headers){
			if(this.headers.hasOwnProperty(name)){
				var val = this.headers[name];
				var str = name +': ' + val;
				if(str.length>70){
					do{
						var line = str.substring(0,70);
						buff.push(line);
						buff.push('\n');
						str = ' '+str.substring(70);
					}while(str.length>70);
					if(str.length>0){
						buff.push(str);
					}
				}else{
					buff.push(str);
				}
				buff.push('\n');
			}
		}
		return buff.join('');
	}

};

module.exports = Manifest;