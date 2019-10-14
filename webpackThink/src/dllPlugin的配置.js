//dllConfig/dll.config.js
var AssetsPlugin = require('assets-webpack-plugin');
var vendors = ['vue'];
var name = '[name]';

module.exports = {
    entry: {
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, '../../dist/vendors'),    //要输出vendor文件的目录
        filename: name + '.js',
        library: name // 这里跟 webpack.DllPlugin 里的 name 保持一致
    },
    plugins: [
        new webpack.DllPlugin({
            path: resolve('./manifest.json'), // manifest.json 生成文件的位置和文件名称。
            name: name, // 这里跟 output.library 保持一致
            context: __dirname // 这里和后面我们要配置的 webpack.DllReferencePlugin 里的 context 保持一致
        }),
        new AssetsPlugin({  //生成bundle-config.json
            filename: './bundle-config.json',
            path: resolve('./')
        })
    ]
}

//dllConfig/manifest.json
`
    {"name":"vendor","content":{"../../node_modules/webpack/buildin/global.js":{"id":0,"buildMeta":{"providedExports":true}},"../../node_modules/vue/dist/vue.runtime.esm.js":{"id":2,"buildMeta":{"exportsType":"namespace","providedExports":["default"]}},"../../node_modules/timers-browserify/main.js":{"id":3,"buildMeta":{"providedExports":true}},"../../node_modules/setimmediate/setImmediate.js":{"id":4,"buildMeta":{"providedExports":true}},"../../node_modules/process/browser.js":{"id":5,"buildMeta":{"providedExports":true}}}}
`

//config.js
buildPlugins.push(
    new webpack.DllReferencePlugin({
        context: path.join(__dirname, '/dllConfig'),
        manifest: require('./dllConfig/manifest.json')
    })
);

//dllConfig/bundle-config.json
`{"vendor":{"js":"vendor.js"}}`


