const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path')

let config = null;

dotenv.config();

Encore
  .addEntry('app', './assets/jsV5/src/main.js')
  .addEntry('register', './assets/jsV5/src/registration/registration.js')
  .enableVueLoader()
  .enableSassLoader(options => {
    options.data = '@import "./assets/jsV5/src/styles/variables.scss";';
  })
  .enablePostCssLoader(options => {
    options.config = {
      path: './assets/jsV5'
    }
  })
  .disableCssExtraction()
  .configureBabel(() => { }, {
    useBuiltIns: 'usage', // or try "usage"
    corejs: 2
  })
  .disableSingleRuntimeChunk()
  .addPlugin(new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'))

if (Encore.isProduction()) {
  Encore
    .setOutputPath('public/build.tmp/')
    .setPublicPath(process.env.PUBLIC_SCHEME + '://' + process.env.VIRTUAL_HOST + '/build/')
    .setManifestKeyPrefix('build/')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps()
    .enableVersioning()

  config = Encore.getWebpackConfig();
} else {
  Encore
    .setOutputPath('./assets/jsV5/dist')
    .setPublicPath('/dist/')
    // .enableEslintLoader(config => {
    //     config.configFile = './assets/jsV5/.eslintrc.js';
    //     console.log(config);
    // });

  config = Encore.getWebpackConfig();

  if (config.devServer) {
    Object.assign(config.devServer, {
      contentBase: path.resolve(__dirname, './assets/jsV5'),
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: './public/index.html' },
          { from: /^\/register/, to: './public/register.html' },
        ],
      },
      proxy: [{
        context: ['/api/1.0.0/**', '/api/2.0.0/**', '/ig/accounts/**'],
        target: 'https://www.directheroes.com/app_dev.php',
        // target: 'https://staging.directheroes.com/app_dev.php',
        // target: 'https://beta2.directheroes.com/app_dev.php',
        // target: 'https://beta.directheroes.com/app_dev.php',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug',
      }],
      disableHostCheck: true,
      inline: true,
      overlay: {
        warnings: true,
        errors: true
      }
    })
  }

  // config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

svgRule.test = /\.(png|jpg|jpeg|gif|ico|webp)$/

config.module.rules.push({
  test: /\.svg$/,
  loader: 'vue-svg-loader',
});

module.exports = config;
