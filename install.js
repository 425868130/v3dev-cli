/**
 * @author xujw 2018-1-24
 * 该脚本在模块安装完成后执行,主要用于补充puppeteer插件,
 * 通过指定命令跳过chromium下载
 */
var fs = require("fs");
/* 获取命令行工具 */
const exec = require('child_process').exec;
/* 获取当前命令行路径 */
const cmdPath=process.cwd();
var userProjectDir=cmdPath.substr(0,cmdPath.indexOf('node_modules'));
/* 尝试读取命令行目录下的package.json文件 */
var packcof;
try{
 packcof=require(userProjectDir+"/package.json");
}catch(e){
 packcof = undefined;
}
if(packcof){
    packcof.scripts.v3init = "v3 init";
    packcof.scripts['v3init-n'] = "v3 init -n";
    /* 保存配置文件到当前项目根路径 */
    try{
        fs.writeFileSync(userProjectDir+"/package.json",JSON.stringify(packcof,null, "\t"));
      }catch(e){
        console.log(e);
        console.log('package.json文件写入失败!');
    }
}

var puppeteerPath = process.execPath.substr(0,process.execPath.lastIndexOf('\\'))+'\\node_modules\\puppeteer';
/* 查看之前是否有puppeteer的全局安装,以确定复制完成后要不要删除全局puppeteer */
var hasGlobalPuppeteer=  fs.existsSync(puppeteerPath)?true:false;
const puppeteerVersion = "0.10.2";

var cliconfig = require('./package');
cliconfig.dependencies.puppeteer=puppeteerVersion;
fs.writeFileSync("./package.json",JSON.stringify(cliconfig,null, "\t"));
console.log('正在安装puppeteer插件......');
exec("npm install puppeteer@"+puppeteerVersion+"  --save --ignore-scripts",(err,stdout,stderr)=>{
    console.log(stdout);
    if(!fs.existsSync(__dirname+'/node_modules/puppeteer')){
        if(fs.existsSync(puppeteerPath)){
            var cmdStr = 'xcopy '+puppeteerPath+'  '+__dirname+'\\node_modules\\puppeteer\\'+' /s /h /y';
            /* 全局安装时puppeteer也会被全局安装,复制一个全局的puppeteer到本模块 */
            require('child_process').execSync(cmdStr);
            if(!hasGlobalPuppeteer){
                exec('rd/s/q '+puppeteerPath);
            }
        }
    }
       /* 安装完成后清空puppeteer的install.js防止后续下载chrome浏览器 */
       try{
        fs.writeFileSync(__dirname+'/node_modules/puppeteer/install.js'," ");
    }catch(e){}
    console.log();
    console.log('插件安装完成.');
});