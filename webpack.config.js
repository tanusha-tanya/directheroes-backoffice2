var Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
var dotenv = require('dotenv');

console.log(dotenv.config());

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build.tmp/')
    // public path used by the web server to access the output path
    .setPublicPath(process.env.PUBLIC_SCHEME + '://' + process.env.VIRTUAL_HOST + '/build/')
    // only needed for CDN's or sub-directory deploy
    .setManifestKeyPrefix('build/')

    .addEntry('app', './assets/js/src/main.js')
    .addEntry('register', './assets/js/src/registration/registration.js')
    .enableVueLoader()
    .addPlugin(new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'))
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableSassLoader()
    .disableCssExtraction()
    .configureBabel(() => {}, {
        useBuiltIns: 'usage', // or try "usage"
        corejs: 2
    })
    .disableSingleRuntimeChunk()
;

module.exports = Encore.getWebpackConfig();
