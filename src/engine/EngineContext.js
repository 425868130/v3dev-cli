/**
 * 引擎执行上下文
 */
var EngineContext = function(){
	this.pool = {};
}
EngineContext.prototype.put = function(key,val){
	this.pool[key] = val;
};

EngineContext.prototype.get = function(key){
	return this.pool[key];
};

module.exports = EngineContext;