# ![](https://raw.githubusercontent.com/425868130/v3dev-cli/master/src/resources/logo.png) V 平台二次开发工具
[![NPM Version](http://img.shields.io/npm/v/v3dev-cli.svg?style=flat)](https://www.npmjs.org/package/v3dev-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/v3dev-cli.svg?style=flat)](https://www.npmjs.org/package/v3dev-cli)  

## 全局安装  
        npm install v3dev-cli -g 
## 局部安装  
        npm install v3dev-cli --save
## 命令列表  
>v3 -h 帮助命令  
v3 init  项目初始化,执行此命令时将在项目路径搜索package.json配置文件,如果有配置文件则可以将当前项目转换为v3项目,若没有则可以根据提示信息创建一个v3项目模板.  
v3 init -n 在当前目录生成一个v3模板项目,并初始化npm依赖.  
v3  install 打包并安装v3平台插件到本地.  
v3 deploy 打包v3平台插件并部署到Vstore.  
v3 update更新插件到V3服务器.  
v3 sync 同步V3服务器中的Node.js插件到本地.   
v3 switch 切换js解析插件,可选的插件有phantomJS与puppeteer.js,其中phantomJS安装时会<font color=#ea6f5a>下载约17M的解析器</font>,puppeteer.js要求本机装有<font color=#ea6f5a>基于chromium核心的浏览器,且内核版本不低于49. 7674</font>.

* 局部安装时对应的命令为:  
>v3&nbsp;init &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3init  
v3 init -n &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3init-n  
v3 install &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3install  
v3 deploy &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3deploy  
v3 update &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3update  
v3 sync &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3sync  
v3 switch &nbsp; &nbsp;>>> &nbsp; &nbsp;npm run v3switch
* 模板项目提供一个局部webpack命令,执行npm run build即可  

## 关于package.json配置项说明
```json
"v3Platform": {
        "type": "插件类型：{[widget]控件,[rule]规则,[func]函数}",
        "matchVersion": "匹配的版本号",
        "minMatchVersion": "最小匹配版本号",
        "account": "Vstore账号",
        "pwd": "Vstore密码",
        "out": "jar生成目录",
        "sources": "vui源目录[可以为目录数组]",
        "libType": "部署库：{dev,test}",
        "server": "本地环境地址",
        "componentDefines": {
            "vuiTreeExtra": {
                "dataProp": "数据源属性名",
                "dataType": "数据类型",
                "treeStructProp": "树形结构属性"
            }
        }
    }
```
* 此部分在项目初始化时可以通过交互命令行进行快速配置,也可以手动修改,以下为一个配置示例:    
```json
"v3Platform": {
        "type": "widget",
        "matchVersion": "1",
        "minMatchVersion": "1",
        "account": "v3账号",
        "pwd": "密码",
        "out": "jar",
        "sources": "dist",
        "libType": "dev",
        "server": "http://10.1.26.72:8888",
        "componentDefines": {
            "vuiTreeExtra": {
                "dataProp": "data",
                "dataType": "String",
                "treeStructProp": "null"
            }
        }
    }
```
## 关于puppeteer插件的chrome浏览器路径配置
由于puppeteer插件安装时会从谷歌下载chrome浏览器,会导致下载失败,所以本工具要求本机装有基于chromium核心的浏览器,且内核版本不低于49. 7674,只需在package.json中的chromiumpath指定本机chrome浏览器的实际路径即可.  
```json
"chromiumpath": "F:\\chrome-win32\\chrome.exe"
```
快速获取浏览器路径:右键浏览器图标查看属性  
<img src="https://raw.githubusercontent.com/425868130/v3dev-cli/master/src/resources/QA/%E8%8E%B7%E5%8F%96%E6%B5%8F%E8%A7%88%E5%99%A8%E8%B7%AF%E5%BE%84.png" width="70%" height="50%"/>  


## FQA  
* Q: 安装时提示 Missing write access to xxx :  
<img src="https://raw.githubusercontent.com/425868130/v3dev-cli/master/src/resources/QA/QA1/QQ%E5%9B%BE%E7%89%8720180126154330.png"/>  
解决方法:到当前安装目录下找到v3dev-cli文件夹删除,然后重新安装即可.全局安装时为nodeJS的安装目录下的node_modules,局部安装时在你项目的node_modules目录下.
<img src="https://raw.githubusercontent.com/425868130/v3dev-cli/master/src/resources/QA/QA1/%E5%88%A0%E9%99%A4%E5%8C%85%E6%96%87%E4%BB%B6.png" width="70%" height="50%"/>



* 已知bug:
v3 sync命令暂无法使用

编辑于:2018-1-26