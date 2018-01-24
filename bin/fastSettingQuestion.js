/**
 * @author xujw 2018-1-23
 * 进行快速项目配置时的问题信息
 */
var VersionReg = new RegExp("\\d+(\\.\\d+){0,2}");
var fastSettingQuestion=[
    {
      message:'项目名称:',
      name:'name',
      default:'v3project'
    },
    {
      type:'list',
      message:'type(插件类型):',
      choices: ['widget', 'rule', 'func'],
      default:'widget',
      name:'v3.type'
    },{
      message:'matchVersion:',
      name:'v3.matchVersion',
      default:'匹配的版本号',
      validate:function(input){
        if(VersionReg.test(input)){
          matchVersionTemp = input;
          return true;
        }
        return '请输入格式正确的版本号(x.x.x)';
      }
    },{
      message:'minMatchVersion:',
      name:'v3.minMatchVersion',
      default:'最小匹配版本号',
      validate:function(input){
        if(VersionReg.test(input)){
          return true;
        }
        return '请输入格式正确的版本号(x.x.x)';
      }
    },
    {
      message:'account:',
      default:'Vstore账号',
      name:'v3.account'
    },
    {
      type:'password',
      message:'pwd:',
      default:'Vstore密码',
      name:'v3.pwd'
    },
    {
      message:'out:',
      default:'构件(jar)生成目录',
      name:'v3.out'
    },{
      message:'sources:',
      default:'vui源目录[可以为目录数组]',
      name:'v3.sources'
    },
    {
      type:'list',
      message:'libType(部署库类型):',
      choices:['dev','test'],
      name:'v3.libType'
    },
    {
      message:'server:',
      default:'本地环境地址',
      name:'v3.server'
    },
    {
      message:'dataProp:',
      default:'数据源属性名',
      name:'v3.componentDefines.vuiTreeExtra.dataProp'
    },
    {
      message:'dataType:',
      default:'数据类型',
      name:'v3.componentDefines.vuiTreeExtra.dataType'
    },
    {
      message:'treeStructProp:',
      default:'树形结构树形',
      name:'v3.componentDefines.vuiTreeExtra.treeStructProp'
    }
  ]

  module.exports=fastSettingQuestion;