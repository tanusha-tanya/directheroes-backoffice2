const webpack = require('webpack');
const fs = require('fs');
const fsExtra = require('fs-extra');
const merge = require('webpack-merge');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development';
const ManifestPlugin = require('webpack-manifest-plugin');
const { WebpackCompilerPlugin } = require('webpack-compiler-plugin');
// const commonTarget = 'https://www.directheroes.com/app_dev.php';
const commonTarget = 'https://staging.directheroes.com/app_dev.php';
// const commonTarget = 'https://beta2.directheroes.com/app_dev.php';
// const commonTarget = 'https://beta.directheroes.com/app_dev.php';

require('dotenv').config({ path: '../../.env' })

const commonConfig = {
  pages: {
    app: {
      entry: './src/main.js',
      template: './public/index.html',
      filename: 'index.html'
    },
    register: {
      entry: './src/registration/registration.js',
      template: './public/register.html',
      filename: 'register.html'
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/styles/variables.scss";`
      }
    }
  },

  configureWebpack: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
    ],

    optimization: {
      splitChunks: false,
    },
  },

  chainWebpack(config) {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
const devConfig = {
  devServer: {
    clientLogLevel: 'info',
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: './public/index.html' },
        { from: /^\/register/, to: './public/register.html' },
      ],
    },
    proxy: {
      '^/api': {
        target: commonTarget,
        changeOrigin: true,
        secure: true,
        logLevel: 'debug'
      },
      '^/ig/accounts': {
        target: commonTarget,
        changeOrigin: true,
        secure: true,
        logLevel: 'debug'
      }
    },
    disableHostCheck: true,
    inline: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
const prodConfig = {
  outputDir: '../../public/build.tmp/',

  publicPath: process.env.PUBLIC_SCHEME + '://' + process.env.VIRTUAL_HOST + '/build/',

  configureWebpack: {
    plugins: [
      new ManifestPlugin({
        basePath: 'build/',
      }),

      new  WebpackCompilerPlugin({
        name: "my-compile-plugin",
        listeners: {
            buildStart: () => {
              if (fs.existsSync('../../public/build.old')) {
                fsExtra.removeSync('../../public/build.old')
              }
            },
            buildEnd: () => {
              if (fs.existsSync('../../public/build')) {
                fs.renameSync('../../public/build', '../../public/build.old');
              }
              if (fs.existsSync('../../public/build.tmp')) {
                fs.renameSync('../../public/build.tmp', '../../public/build');
              }
            },
        },
    })
    ]
  },

  css: {
    extract: false,
  }
}

module.exports = merge(commonConfig, isDev ? devConfig : prodConfig)