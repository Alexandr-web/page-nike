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
        .pipe(dest('dist/'))
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
        .pipe(dest('dist/css/'))
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
        .pipe(dest('dist/js/'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/images/'))
        .pipe(browserSync.stream());
}

function build() {
    return parallel(images, typeScript, styles, html, javaScript);
}

function reloadingBrowser() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
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

exports.default = parallel(build, watching, reloadingBrowser);