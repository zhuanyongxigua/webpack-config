'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const { styles } = require('@ckeditor/ckeditor5-dev-utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
  var temp = path.join(__dirname, '..', dir)
  console.log(temp)
  return temp
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: [
    require.resolve( 'regenerator-runtime/runtime.js' ),
    './src/main.js'
  ],
  // entry: './src/main.js',
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // include: [
        //   resolve('src'),
        //   resolve('test')
        // ],
        options: {
          configFile: resolve('babel.config.js')
          // filename: '../.babelrc'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [
          resolve('node_modules/@ckeditor')
        ],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: [ 'raw-loader' ]
      },
      {
        // test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
        test: /ckeditor5-[^\/\\]+[\/\\].+\.css$/,
        use: [
          // {
          //   loader: 'style-loader',
          //   options: {
          //     injectType: 'singletonStyleTag'
          //   }
          // },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
              },
              minify: true
            })
          },
        ]
      },
      // {
      //   test: /ckeditor5-[^\/\\]+[\/\\].+\.js$/,
      //   loader: 'babel-loader',
      //   options: {
      //     // ckeditor官方那种require配置的写法不能用的，格式是错的，那种应该是其他版本的webpack中babel的配置
      //     presets: ['@babel/preset-env']
      //   }
      // },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CKEditorWebpackPlugin({
      language: 'en'
    }),
    new MiniCssExtractPlugin( {
      filename: 'styles.css'
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
