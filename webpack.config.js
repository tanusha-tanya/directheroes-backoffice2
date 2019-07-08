const Encore = require('@symfony/webpack-encore');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path')

let config = null;

dotenv.config();

Encore
    .addEntry('app', './assets/js/src/main.js')
    .addEntry('register', './assets/js/src/registration/registration.js')
    .enableVueLoader()
    .enableSassLoader()
    .enablePostCssLoader(options => {
        options.config = {
            path: './assets/jsV5'
        }
    })
    .disableCssExtraction()
    .configureBabel(() => {}, {
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
        .setOutputPath('./assets/js/dist')
        .setPublicPath('/dist/')
        // .enableEslintLoader(config => {
        //     config.configFile = './assets/jsV5/.eslintrc.js';
        // });

    config = Encore.getWebpackConfig()

    if (config.devServer) {
        Object.assign(config.devServer, {
            contentBase: path.resolve(__dirname, './assets/js'),
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: './index.html' },
                    { from: /^\/register/, to: './register.html' },
                ],
            },
            proxy: [{
                context: ['/api/1.0.0/**', '/api/2.0.0/**', '/ig/accounts/**'],
                // target: 'https://www.directheroes.com/app_dev.php',
                // target: 'https://staging.directheroes.com/app_dev.php',
                target: 'https://beta2.directheroes.com/app_dev.php',
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

    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}


    // Encore
//     // directory where compiled assets will be stored
//     .setOutputPath('public/build.tmp/')
//     // public path used by the web server to access the output path
//     .setPublicPath(process.env.PUBLIC_SCHEME + '://' + process.env.VIRTUAL_HOST + '/build/')
//     // only needed for CDN's or sub-directory deploy
//     .setManifestKeyPrefix('build/')

//     .addEntry('app', './assets/js/src/main.js')
//     .addEntry('register', './assets/js/src/registration/registration.js')
//     .enableVueLoader()
//
//     .cleanupOutputBeforeBuild()
//     .enableBuildNotifications()
//     .enableSourceMaps(!Encore.isProduction())
//     .enableVersioning(Encore.isProduction())
//     .enableSassLoader()
//     .disableCssExtraction()
//     .configureBabel(() => {}, {
//         useBuiltIns: 'usage', // or try "usage"
//         corejs: 2
//     })
//     .disableSingleRuntimeChunk()
// ;

module.exports = config;
