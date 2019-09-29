/* server.js */
const fs = require('fs');
const path = require('path');
const exp = require('express');
const express = exp();
const resolve = file => path.resolve(__dirname, file);
const {createRenderer} = require('vue-server-renderer');
var template = fs.readFileSync(resolve('./index.ssr.html'), 'utf-8')
const renderer = createRenderer({
    template
})
const createApp = require('./dist/bundle.server.js')['default']

// 设置静态文件目录
express.use('/', exp.static(__dirname + '/dist'))
const clientBundleFileUrl = '/bundle.client.js'

express.get('/api/getHomeInfo', (req, res) => {
    res.send('SSR发送请求')
})

// 响应路由请求
express.get('*', (req, res) => {
    const context = { url: req.url }
    context.head = '<meta name="keywords" content="ccc">'
    // 创建vue实例，传入请求路由信息，因为创建vue实例涉及到很多步骤，所以这里是一个promise回调函数。
    createApp(context).then(app => {
        let state = JSON.stringify(context.state);
        console.log('context',context)
        //将返回的实例app信息传入渲染器中进行处理
        //context上存在一些特定属性时，模板会自动注入对应的内容：
        //context.state：（对象）初始 Vuex store 状态，将以 window.__INITIAL_STATE__ 的形式内联到页面。内联的 JSON 将使用 serialize-javascript 自动清理，以防止 XSS 攻击。
        //函数签名（由createRenderer创建的渲染器）： renderer.renderToString(vm, context?, callback?): ?Promise<string>
        //函数签名（由createBundleRenderer创建的渲染器）： renderer.renderToString(context?, callback?): ?Promise<string>
        renderer.renderToString(app, context, (err, html) => {
            if (err) { return res.state(500).end('运行时错误') }
            console.log('bbb',html)
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
            res.send(html)
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