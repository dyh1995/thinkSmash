### No parser and no filepath given, using 'babel' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred
##### 原因：
vue-loader使用prettier，如下
```JavaScript
code = prettier.format(code, { semi: false })
```
vue-loader没有指定parser，使用prettier提供的默认parser。而prettier 1.3.0移除了使用默认的parser来解析文件，这样就导致了No parser的错误。

##### 解决方法：
方法一：
在package.json强制设置prettier的版本，降低为prettier1.12.1:
方法二：
vue-loader@13.7.2 和vue-loader@14.2.3是已经修复了，修复内容如下：
```JavaScript
code = prettier.format(code, { semi: false, parser: 'babylon' })
```
指定了parser为babylon。

### vue-cli的使用方法
npm install -g @vue/cli@3.2.1
vue create hello-world
选择Manually select features可以进行自定义配置