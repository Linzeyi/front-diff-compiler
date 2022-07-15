const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: './src/App.vue',
    main: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    clean: true,
  },
  externals: {
    vue: 'vue'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json', '.vue'],
    alias: {
      '@': path.resolve('./src')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, './public/index.html') ,
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue/,
        use: [
          {
            loader: 'vue-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: path.resolve('./loader/case-loader')
          }
        ]
      }
    ]
  }
}