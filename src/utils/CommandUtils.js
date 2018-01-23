var Commands = {
	"install" : "打包v3平台插件到本地",
	"deploy" : "打包v3平台插件并部署到Vstore",
	"updateToServer" : "更新插件到V3服务器",
	"sync" : "同步V3服务器中的Nodejs插件到本地"
}

exports.getAllDesc = function(){
	var buff = [];
	var index = 1;
	for(var command in Commands){
		buff.push(index);
		buff.push('、');
		buff.push(command);
		buff.push(':');
		buff.push(Commands[command]);
		buff.push('\n');
		index++;

	}
	buff.pop();
	return buff.join('');
}

exports.isAvaliable = function(command){
	return !!Commands[command];
}