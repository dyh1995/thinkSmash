/* webpack.client.js */
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')


module.exports = {
      devtool: 'source-map',
      entry: [path.join(projectRoot, 'entry/index-client.js')],
      output: {
            path: path.join(projectRoot, 'dist'),
            filename: 'bundle.client.js',
      },
      module: {
            rules: [{
                        test: /\.vue$/,
                        loader: 'vue-loader'
                  },
                  {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        include: projectRoot,
                        exclude: /node_modules/,
                        options: {
                              presets: ['es2015']
                        }
                  }
            ]
      },
      plugins: [
            // 此插件在输出目录中
            // 生成 `vue-ssr-client-manifest.json`。
            new VueSSRClientPlugin()
      ],
      resolve: {
            alias: {
                  'vue$': 'vue/dist/vue.runtime.esm.js'
            }
      }
};