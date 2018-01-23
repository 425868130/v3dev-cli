var VjsToXml = require("./VjsToXml");
var Vjs = require("./Vjs");
var Service = require("./Service");
var Module = require("./Module");
var Dependency = require("./Dependency");
var vjsList = [];
var modules = [new Module({
	id:"902570732/1539669926_3714s",
	name:"./JGDataGrid_JGTextBoxAction",
	factory:`function(require,exports,module){>>}`
})];
var vjs = new Vjs({
	name:"vjs.framework.extension.ui.plugin.smartclient.JGDataGrid",
	version:"3.7.14.SNAPSHOT",
	dependencies:[
		new Dependency({
			name:"vjs.framework.extension.platform.services.view.widget.common.context"
		})
	],
	services:[
		new Service({
			name:"vjs.framework.extension.ui.plugin.JGDataGrid.action.JGDataGrid_JGTextBoxAction",
			implementation:"./JGDataGrid_JGTextBoxAction",
			pros:'{"type":"smartclient"}',
			module:modules[0]
		})
	],
	modules:modules
});
var vjs1 = new Vjs({
	name:"vjs.framework.extension.ui.plugin.smartclient.JGDataGrid",
	version:"3.7.14.SNAPSHOT",
	dependencies:[
		new Dependency({
			name:"vjs.framework.extension.platform.services.view.widget.common.context"
		})
	],
	services:[
		new Service({
			name:"vjs.framework.extension.ui.plugin.JGDataGrid.action.JGDataGrid_JGTextBoxAction",
			implementation:"./JGDataGrid_JGTextBoxAction",
			pros:'{"type":"smartclient"}',
			module:modules[0]
		})
	],
	modules:modules
});
vjsList.push(vjs);
vjsList.push(vjs1);
var vjsToXml = new VjsToXml({
	vjsList:vjsList
});
console.log(vjsToXml.toXML());
