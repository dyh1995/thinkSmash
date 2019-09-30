
### 一、项目说明
本项目实现了一个最基本的VueSSR demo，用于对vue-ssr原理进行了解学习

### 二、ssr的目的
1. SEO
2. 加速首屏渲染

### 三、下载依赖
```
$ npm i vue
$ npm i express
$ npm i vue-server-renderer
```
### 四、项目目录
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

### 五、步骤
#### server端
1. node服务器接收到get请求，根据url判断缓存，若存在，直接返回缓存页面；不存在则创建app;
2. 调用createApp(context)，进入到server入口文件，创建app实例；
3. promiseAll调用所有需要直出的组件中的接口请求数据（请求到数据后更新store）;
4. 获取到所有数据后，context上挂载store，返回app实例
5. 调用渲染器renderToString方法进行渲染，渲染完毕后返回html字符串，添加页面缓存;
6. 渲染时如果渲染器使用bundle创建，app实例不需要作为参数传入renderToString方法，同时由于
   context上由state这个属性，渲染器会自动序列化store到window.__INITIAL_STATE__ 属性上
7. 使用bundle模式打包配置
```
plugins: [
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
],
plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin()
],
```
8. 使用bundle的好处：
* 内置的 source map 支持（在 webpack 配置中使用 devtool: 'source-map'）
* 在开发环境甚至部署过程中热重载（通过读取更新后的 bundle，然后重新创建 renderer 实例）
* 关键 CSS(critical CSS) 注入（在使用 *.vue 文件时）：自动内联在渲染过程中用到的组件所需的CSS。
* 使用 clientManifest 进行资源注入：自动推断出最佳的预加载(preload)和预取(prefetch)指令，以及初始渲染所需的代码分割 chunk。
* bundle.client.js会自动注入到body结尾之前

#### client端
1. 创建app实例
2. 同步服务端状态树信息
```
if (window.__INITIAL_STATE__) {
    app.$store.replaceState(window.__INITIAL_STATE__)
}
```
3. 绑定app根元素

### 六、缓存(分为页面级别和组件级别)
可以利用名为 micro-caching 的缓存策略，来大幅度提高应用程序处理高流量的能力
1. 引入模块
```
const LRU = require('lru-cache');
```
2. 页面级别缓存
```
const microCache = new LRU({
    max: 100,
    maxAge: 1000 // 重要提示：条目在 1 秒后过期。
});
```
3. 接收到请求后判断是否存在缓存
```
if(req.url == '/home'){
    const hit = microCache.get(req.url);
    if (hit) {
        return res.send(hit);
    }
}
```
4. 设置缓存
```
if (context.url == '/home') {
    microCache.set(req.url, html);
}
``` 

### 七、参考文章
1. [Vue SSR 指南](https://ssr.vuejs.org/zh/api/ "Vue SSR 指南")
2. [从0开始，搭建Vue2.0的SSR服务端渲染](https://www.jianshu.com/p/c6a07755b08d "从0开始，搭建Vue2.0的SSR服务端渲染")

