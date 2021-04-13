//! gulp-sass 
//! watch - слежение за проектом, файлами
//! gulp-concat - rename
//! gulp-autoprefixer
const { src, dest, watch, parallel, series } = require ('gulp');
const scss          = require ('gulp-sass');
const concat        = require ('gulp-concat');
const autoprefixer  = require ('gulp-autoprefixer');

function styles () {
    //! Путь к scss
    return src ('app/scss/**/*.scss')
        //! Конпиляция файла в css, чтобы красиво отображался css надо заменить compressed => expanded
        .pipe (scss({outputStyle: 'compressed'}))
        .pipe (concat('style.min.css')) //! Переименовка в slyte.min.css
        .pipe (autoprefixer({
            overrideBrowserslist : ['last 10 version'],
            grid: true
        }))
        .pipe (dest('app/css'))
        .pipe (browserSync.stream()) //! обновление браузера
}

//! Слежение за проектом
function watching () {
    //! Слежение за всеми внутренними папки файлами и запуска styles
    //* ! - кроме файла 
    watch (['app/scss/**/*.scss'], styles) 
    watch (['app/js/**/*.js', '!app/js/main.min.js'], scripts) 
    watch (['app/*.html']).on('chenge', browserSync.reload)
}


//! browser-sync
const browserSync   = require ('browser-sync').create();

function browsersync () {
    //! Иницилизация
    browserSync.init ({
        server : {
            baseDir: 'app/'
        }
    });
}

//!gulp-uglify-es (js) jquery
const uglify        = require ('gulp-uglify-es').default;


function scripts () {
    return src ([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe  (concat('main.min.js'))
    .pipe  (uglify())
    .pipe  (dest('app/js'))
    .pipe  (browserSync.stream())
}

//! gulp-imagemin
const imagemin        = require ('gulp-imagemin');

function images () {
    return src              ('app/images/**/*')
    .pipe (imagemin([
        imagemin.gifsicle   ({interlaced: true}),
        imagemin.mozjpeg    ({quality: 75, progressive: true}),
        imagemin.optipng    ({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe                   (dest('dist/images'))
}

//! tack build - сборка в dist
function build () {
    return src ([
        'app/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/fonts/**/*',
        
    ], {base: 'app'}) //! собирал с папками
    .pipe (dest('dist'))
}

//! del - удаление dista
const del             = require ('del');

function cleanDist() {
    return del('dest')
}


//! выполнение функции
exports.styles      = styles;
exports.watching    = watching;
exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanDist   = cleanDist;


exports.build       = series   (cleanDist, images, build);
exports.default     = parallel (styles, scripts, browsersync, watching); //! запуск 2х функций
