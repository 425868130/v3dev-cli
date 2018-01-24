/**
 * @author xujw 2018-1-23
 * 多个命令共同执行的操作
 */
var fs = require('fs');
/* 获取当前命令行路径 */
const cmdPath=process.cwd();
var engineFactory = require("../src/engine/EngineFactory");
var pathUtils = require("../src/utils/PathUtils");
var environment = require("../src/utils/Environment");

 /* 尝试读取命令行目录下的package.json文件 */
 var packcof;
 try{
  packcof=require(cmdPath+"/package.json");
 }catch(e){
    console.log(e);
     console.log('配置文件加载失败!');
 }
 environment.setPackageObj(packcof);
 environment.setPluginTempDir(pathUtils.getV3PluignTempRelativeDir());
 
module.exports= engineFactory.createEngine