/** @author xujw 2018-1-30
 * 使用phantomJS进行解析
 */
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;
var extraLibs = process.argv.slice(2);
/* 子进程参数,第一个为要执行的脚本文件路径 ,第二个参数为当前目录,后续参数为要解析的js源路径*/
var childArgs = [path.join(__dirname, 'phantomjs-script.js'),__dirname];
for(i=0,len=extraLibs.length;i<len;i++){
    childArgs.push(extraLibs[i]);
}
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  if (!err) {
    process.send(stdout);
  }
});