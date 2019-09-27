var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: __dirname+'/dist/',
        filename: "bundle.js"
    },
}

if (process.env.NODE_ENV === 'production') {
    // module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
    //   new webpack.optimize.UglifyJsPlugin({
    //     sourceMap: true,
    //     compress: {
    //       warnings: false
    //     }
    //   }),
    //   new webpack.LoaderOptionsPlugin({
    //     minimize: true
    //   })
    ])
  }
  