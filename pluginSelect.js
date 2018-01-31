/**
 * @author xujw 2018-1-30
 * js解析插件切换命令,完成js解析插件的切换,切换时提供选项供用户选择
 * 且切换完成后自动更新依赖
 */
var fs = require("fs");
/* 获取命令行工具 */
const exec = require('child_process').exec;
/* 交互式命令行工具 */
const prompt = require('inquirer').prompt;
/* 获取当前模块配置文件 */
var cliconfig = require(__dirname+'/package');
var pluginList=['phantomJS','puppeteer'];
/* 获取当前命令行路径 */
const cmdPath=process.cwd();
/* 尝试读取命令行目录下的package.json文件 */
var packcof;
try{
 packcof=require(cmdPath+"/package.json");
}catch(e){
 packcof = false;
}

/* 安装 puppeteer插件*/
function puppeteerInstall(){
    const puppeteerVersion = "0.10.2";
    cliconfig.analyzer = pluginList[1];
    fs.writeFileSync(__dirname+"/package.json",JSON.stringify(cliconfig,null, "\t"));
    exec("npm --registry https://registry.npm.taobao.org install puppeteer@"+puppeteerVersion,{cwd:__dirname,env:{PUPPETEER_SKIP_CHROMIUM_DOWNLOAD:1}},(err,stdout,stderr)=>{
        console.log(stdout);
           /* 安装完成后清空puppeteer的install.js防止后续下载chrome浏览器 */
           try{
            fs.writeFileSync(__dirname+'/node_modules/puppeteer/install.js'," ");
        }catch(e){}
        console.log();
        console.log('插件安装完成.');
        /* 如果用户项目存在package.json则添加chromepath */
        if(packcof){
            prompt([{
                message:'chromiumpath:',
                name:'chromiumpath',
                default:'Chromium核心的Chromium浏览器(推荐)或chrome浏览器的路径地址'
              }]).then(answers=>{
                  packcof.chromiumpath = answers.chromiumpath;
                  fs.writeFile(cmdPath+"/package.json",JSON.stringify(packcof,null, "\t"));
              });
        }
    });
}
/* 安装phantomJS插件 */
function phantomInstall(){
    cliconfig.analyzer = pluginList[0];
    fs.writeFileSync(__dirname+"/package.json",JSON.stringify(cliconfig,null, "\t"));
    exec('npm --registry https://registry.npm.taobao.org install phantomjs-prebuilt --save',{cwd:__dirname},(err,stdout,stderr)=>{
        console.log(stdout);
        if(!err){
            if(packcof&&'chromiumpath' in packcof){
                delete packcof.chromiumpath;
                fs.writeFile(cmdPath+"/package.json",JSON.stringify(packcof,null, "\t"));
            }
            console.log();
            console.log('插件安装完成');
        }
    });
}
var selectPlugin = function(){
    prompt([{
        type:'list',
        name:'analyzer',
        choices:pluginList,
        message:'选择解析插件(puppeteer需要本机安装有chromium核心浏览器,phantomJS需下载约17M的解析器):'
    }]).then(answers=>{
        console.log('正在安装'+answers.analyzer+'插件.......');
        if(answers.analyzer=='phantomJS'){
            exec('npm uninstall puppeteer --save',{cwd:__dirname},(err,stdout,stderr)=>{
                phantomInstall();
            });
        }
        else if(answers.analyzer=='puppeteer'){
            exec('npm uninstall phantomjs-prebuilt --save',{cwd:__dirname},(err,stdout,stderr)=>{
                puppeteerInstall();
            });
        }
    });
}

module.exports =selectPlugin;