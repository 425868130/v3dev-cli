var xml2js = require("xml2js");

var VjsToXml = function(params){
	this.vjsList = params.vjsList||[];
}

VjsToXml.prototype = {

	toXML : function(){
		var define = {};
		define.version = "1.0";
		var vjsList = [];
		define.vjs = vjsList;
		for(var i=0,l=this.vjsList.length;i<l;i++){
			var vjs = this.vjsList[i];
			vjsList.push(vjs.toXmlObj());
		}
		var builder = new xml2js.Builder({
			cdata:true
		});
		//console.log(JSON.stringify(define));
		return builder.buildObject(define);
	}

}

module.exports = VjsToXml;