/**
 * @author xujw 2018-1-23
 * 进行快速项目配置时的问题信息
 */
var fastSettingQuestion=[
    {
      message:'项目名称:',
      name:'name'
    },
    {
      message:'插件类型(控件|规则|函数):',
      name:'type'
    },{
      message:'匹配的版本号:',
      name:'matchVersion'
    },
    {
      message:'Vstore账号:',
      name:'account'
    },
    {
      type:'password',
      message:'Vstore密码:',
      name:'pwd'
    },
    {
      message:'构件(jar)生成目录:',
      name:'out'
    },
    {
      message:'部署库(dev|test):',
      name:'libType'
    },
    {
      message:'本地环境地址:',
      name:'server'
    }
  ]

  module.exports=fastSettingQuestion;