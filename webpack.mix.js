const mix = require('laravel-mix');
const glob = require('glob');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
 mix.webpackConfig({
    stats: {
        children: true,
    },
});
// mix.js('resources/js/app.js', 'public/js')
//     .postCss('resources/css/app.css', 'public/css', [
//         //
//     ]);
mix.ts('resources/ts/index.tsx', 'public/js')
    // .sass('resources/sass/app.scss', 'public/css', [
    //     //
    // ]);
glob.sync('resources/sass/*.scss').map(function(file){
    mix.sass(file, 'public/css');
});