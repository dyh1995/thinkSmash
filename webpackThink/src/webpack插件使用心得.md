### css压缩插件
```
    const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
    const baseConfig = {
        plugins: [
            new OptimizeCSSAssetsPlugin({})
        ]
    }
```

### css提取插件
ExtractTextPlugin插件配合css-loader将css文件link到html，filename是打包出来的文件名
```
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const baseConfig = {
        plugins: [
            new ExtractTextPlugin({
                filename:'static/[name]/css/index.css?v=[md5:contenthash:hex:20]'
            }),
        ]
    }
```

### 公共文件的提取插件，链接提取dll文件
1. 创建dll配置文件
```
var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var name = '[name]';

function resolve (dir) {
    return path.join(__dirname, dir);
}

var vendors = ['vue', 'vuex'];  //设置需要提取的公共文件

module.exports = {
    output: {
        path: path.resolve(
            __dirname,
            'xxx/dist/vendors'
        ),
        filename: name + '.js',
        library: name // 这里跟 webpack.DllPlugin 里的 name 保持一致
    },
    resolve: {
        modules: [
            // 用来设置模块搜索的目录,省略路径书写
            resolve('../../node_modules') // 给生成的manifest.json使用
        ]
    },
    entry: {
        vendor: vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: resolve('./manifest.json'), // manifest.json 生成文件的位置和文件名称。
            name: name, // 这里跟 output.library 保持一致
            context: __dirname // 这里和后面我们要配置的 webpack.DllReferencePlugin 里的 context 保持一致
        }),
        new AssetsPlugin({
            // AssetsPlugin的作用主要是生成当前输出的dll文件名映射,解决缓存更新问题,在config.js里面可以直接引用bundle-config.json的vendor.js使用输出的vendor文件名,而不用在打包更新dll后手动更新config里面引用到dll的配置.
            filename: './bundle-config.json',
            path: resolve('./')
        })
        // new ExtractTextPlugin({  //如果vendors有需要打包的公共css,放开此注释,可以打包到vendors下static/effect.css
        //     filename: getPath => {
        //         return utils.assetsPath('effect.css');
        //     }
        // }),
    ]
};
```

2. package.json增加命令
"dll": "./node_modules/.bin/webpack --mode production --progress --colors --config build/dllConfig/dll.config.js",
执行后会生成manifest.json文件和vendor.js文件

3. webpack配置添加dll设置

```
    const webpack = require('webpack');
    const baseConfig = {
        plugins: [
            new webpack.DllReferencePlugin({
                context: path.join(__dirname, '/dllConfig'),
                manifest: require('./dllConfig/manifest.json')
            })
        ]
    }
```

4. 打包自己的文件，可以看到公共文件并没有被打包进来

### 图片压缩(两个插件)
```
    const ImageminPlugin = require('imagemin-webpack-plugin').default;
    const baseConfig = {
        plugins: [
            new ImageminPlugin({
                disable: process.env.NODE_ENV !== 'production',
                pngquant: {
                    quality: 70
                }
            });
        ]
    }
    
    const tinyPngWebpackPlugin = require('tinypng-webpack-plugin');
    const baseConfig = {
        plugins: [
            new tinyPngWebpackPlugin({
                key:"OTDVlvKib83gk7Ys3iX1HB6FzpSFiKOZ",
                ext: ['png'],//由于压缩较慢，故压缩PNG，其他图片请在切图时自行压缩
            })
        ]
    }
```

### js压缩混淆
```
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    optimization: {
        minimizer: [new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        properties: false,
                        drop_debugger: true,
                        drop_console: true,
                        sequences: true,
                        dead_code: true,
                        conditionals: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true
                    },
                    output: {
                        ascii_only: true,
                        // 去掉注释内容
                        // comments: true
                        keep_quoted_props: true,
                        beautify: false,
                        comments: false
                    },
                    mangle: {}
                }
            }
        )],
    }
```

### 更好的代码错误提示
```
    const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
    const baseConfig = {
        plugins: [
            new FriendlyErrorsPlugin();
        ]
    }
```