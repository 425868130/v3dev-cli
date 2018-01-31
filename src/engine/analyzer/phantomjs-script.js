/**
 * @author xujw 2018年1月29日
 * phantomJS执行脚本将index.html载入获取vui组件信息
 */
//创建一个webpage对象
var page = require('webpage').create();
var fs = require('fs');

var system = require('system');
const extraLibs = system.args.slice(2);
const thisdir = system.args[1];
// 打开页面
page.open(
    'file:///' +thisdir+ '/browser/index.html', function(status) {
      /* 先将所有找到的js文件在页面上运行 */
    for (i = 0, len = extraLibs.length; i < len; i++) {
        var content = fs.read(extraLibs[i]);
        if (content.length > 0) {
          page.evaluateJavaScript('function(){' + content + '}');
        }
      }
      /* 执行组件查找方法 */
      var result=(page.evaluate(function() {
        var searcher = new ExtensionComponentSearcher();
        return searcher.search();
      }));
      console.log(JSON.stringify(result));
      phantom.exit();
    });

    page.onError = function(msg, trace) {
      var msgStack = ['ERROR: ' + msg];
      if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
      }
      console.error(msgStack.join('\n'));
    };