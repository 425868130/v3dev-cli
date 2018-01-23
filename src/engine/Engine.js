/**
 * 命令执行引擎
 */
var EngineContext = require("./EngineContext");

 var Engine = function(taskList){
 	this.index = 0;
 	this.context = new EngineContext();
 	this.taskList = taskList;
 }

 Engine.prototype = {

 	start : function(){
 		if(this.index<this.taskList.length){
 			var task = this.taskList[this.index];
 			try{
 			var promise = task.exe(this.context);
 			}catch(e){
 				console.log(e);
 				for(var i=0;i<this.index;i++){
 					var task = this.taskList[i];
 					task.handleError(this.context);
 				}
 			}
 			promise.then((function(engine){
 				return function(){
 					engine.index++;
 					engine.start();
 				};
 			})(this));
 		}else{
 			for(var i=0,l=this.taskList.length;i<l;i++){
 				var task = this.taskList[i];
 				task.beforeDone(this.context);
 			}
 		}
 	}

 }

 module.exports = Engine;