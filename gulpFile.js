const { src, dest, parallel, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const scss = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');

function html() {
    return src('src/*.html')
        .pipe(dest('docs/'))
        .pipe(browserSync.stream());
}

function styles() {
    return src(['src/scss/*.scss', '!src/scss/_*.scss'])
        .pipe(scss({ outputStyle: 'expanded' }))
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 5 versions']
        }))
        .pipe(concat('main.css'))
        .pipe(dest('docs/css/'))
        .pipe(browserSync.stream());
}

function typeScript() {
    return src('src/typescript/*.ts')
        .pipe(ts())
        .pipe(dest('src/js/'))
        .pipe(browserSync.stream());
}

function javaScript() {
    return src('src/js/*.js')
        .pipe(webpack())
        .pipe(concat('main.js'))
        .pipe(dest('docs/js/'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin())
        .pipe(dest('docs/images/'))
        .pipe(browserSync.stream());
}

function reloadingBrowser() {
    browserSync.init({
        server: {
            baseDir: 'docs/'
        }
    });
}

function watching() {
    watch('src/*.html', parallel(html));
    watch('src/scss/*.scss', parallel(styles));
    watch('src/typescript/*.ts', parallel(typeScript));
    watch('src/typescript/*.ts', parallel(javaScript));
    watch('src/images/**/*', parallel(images));
}

exports.build = parallel(images, typeScript, styles, html, javaScript);
exports.default = parallel(exports.build, watching, reloadingBrowser);