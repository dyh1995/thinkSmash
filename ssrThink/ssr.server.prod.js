/* server.js */
const fs = require('fs');
const path = require('path');
const exp = require('express');
const LRU = require('lru-cache');
const express = exp();
const resolve = file => path.resolve(__dirname, file);
const {createBundleRenderer} = require('vue-server-renderer');
var template = fs.readFileSync(resolve('./index.ssr.html'), 'utf-8')

const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const bundle = require('./dist/vue-ssr-server-bundle.json');

const renderer = createBundleRenderer(bundle, {
    template,
    clientManifest,
    runInNewContext: false, //只用于 createBundleRenderer
})
const createApp = require('./dist/bundle.server.js')['default'];
const microCache = new LRU({
    max: 100,
    maxAge: 1000 // 重要提示：条目在 1 秒后过期。
});

// 设置静态文件目录
express.use('/', exp.static(__dirname + '/dist'));

express.get('/api/getHomeInfo', (req, res) => {
    res.send('SSR发送请求')
})

// 响应路由请求
express.get('*', (req, res) => {
    console.log('req',req.url)
    if(req.url == '/home'){
        const hit = microCache.get(req.url);
        if (hit) {
            return res.send(hit);
        }
    }
    
    const context = { url: req.url }
    context.head = '<meta name="keywords" content="添加head标签">';  //可以在context上添加head标签
    // 创建vue实例，传入请求路由信息，因为创建vue实例涉及到很多步骤，所以这里是一个promise回调函数。
    createApp(context).then(app => {
        //将返回的实例app信息传入渲染器中进行处理
        //context上存在一些特定属性时，模板会自动注入对应的内容：
        //context.state：（对象）初始 Vuex store 状态，将以 window.__INITIAL_STATE__ 的形式内联到页面。内联的 JSON 将使用 serialize-javascript 自动清理，以防止 XSS 攻击。
        //函数签名（由createRenderer创建的渲染器）： renderer.renderToString(vm, context?, callback?): ?Promise<string>
        //函数签名（由createBundleRenderer创建的渲染器）： renderer.renderToString(context?, callback?): ?Promise<string>

        //使用bundle的好处：
        //1. 内置的 source map 支持（在 webpack 配置中使用 devtool: 'source-map'）
        //2. 在开发环境甚至部署过程中热重载（通过读取更新后的 bundle，然后重新创建 renderer 实例）
        //3. 关键 CSS(critical CSS) 注入（在使用 *.vue 文件时）：自动内联在渲染过程中用到的组件所需的CSS。
        //4. 使用 clientManifest 进行资源注入：自动推断出最佳的预加载(preload)和预取(prefetch)指令，以及初始渲染所需的代码分割 chunk。
        renderer.renderToString(context, (err, html) => {
            if (err) { return res.state(500).end('运行时错误') }
            // console.log('send',html)
            // res.send(`
            //     <!DOCTYPE html>
            //     <html lang="en">
            //         <head>
            //             <meta charset="UTF-8">
            //             <title>Vue2.0 SSR渲染页面</title>
                        
            //             <script src="${clientBundleFileUrl}"></script>
            //         </head>
            //         <body>
            //             <div id="app">${html}</div>
            //         </body>
            //     </html>
            // `)
            res.send(html);
            if (context.url == '/home') {
                microCache.set(req.url, html);
            }
        })
    }, err => {
        console.log(err)
        if(err.code === 404) { res.status(404).end('所请求的页面不存在') }
    })
})


// 服务器监听地址
express.listen(8085, () => {
    console.log('服务器已启动！')
})