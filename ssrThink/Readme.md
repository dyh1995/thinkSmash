### 参考文章
1. [webpack模块化原理-ES module](https://www.jianshu.com/p/c6a07755b08d "webpack模块化原理-ES module")
2. [Vue SSR 指南](https://ssr.vuejs.org/zh/api/ "Vue SSR 指南")

### 项目说明
本项目实现了一个最基本的VueSSR demo，用于对vue-ssr原理进行了解学习

### ssr的目的
1. SEO
2. 加速首屏渲染

### 一、下载依赖
```
$ npm i vue
$ npm i express
$ npm i vue-server-renderer
```
### 项目目录
```
---
 |--ssr.server.prod.js  //node服务器启动文件
 |--build
 |---|--ssr.webpack.client.js   //client端打包配置
 |---|--ssr.webpack.server.js   //server端打包配置
 |--dist
 |---|--bundle.client.js        //打包后的client端运行文件
 |---|--bundle.server.js        //打包后的server端运行文件
 |--entry
 |---|--index-client.js         //client端入口源文件
 |---|--index-server.js         //server端入口源文件
 |--src
 |---|--routes
 |---|---|--animal.vue          //vue页面组件1
 |---|---|--home.vue            //vue页面组件2
 |---|---|--people.vue          //vue页面组件3
 |---|--App.vue                 //主vue文件
 |---|--main.js                 //主文件
 |---|--route.js                //路由
 |---|--store.js                //状态树
```

### 二、步骤
1. 客户端发起请求到server获取死数据静态页面
2. 拆分client和server，客户端实现spa，切换路由时不再发起请求
3. server写死数据改为store获取，通过window.__INITIAL_STATE__ 属性传递server端的store到client。
