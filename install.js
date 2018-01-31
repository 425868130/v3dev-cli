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
 packcof = false;
}
if(packcof){
    packcof.scripts.v3init = "v3 init";
    packcof.scripts['v3init-n'] = "v3 init -n";
    packcof.scripts.v3switch="v3 switch";
    /* 保存配置文件到当前项目根路径 */
    try{
        fs.writeFileSync(userProjectDir+"/package.json",JSON.stringify(packcof,null, "\t"));
      }catch(e){
        console.log(e);
        console.log('package.json文件写入失败!');
    }
}
require('./pluginSelect')();
