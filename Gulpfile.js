var gulp = require('gulp'),
    sass = require('gulp-sass'),
    argv = require('yargs').argv,
    log = require('fancy-log'),
    browserSync = require('browser-sync').create(),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

var SOURCE = {
  scss: 'scss/' + argv.feature + '.scss'
};

var DEST = {
  css: 'public/' + argv.feature + ''
};

var html =  '<!DOCTYPE html>' + '\n' +
            '<html>' + '\n' +
            '\t' + '<head>' + '\n' +
            '\t\t' + '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>' + '\n' +
            '\t\t' + '<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">' + '\n' +
            '\t\t' + '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css">' + '\n' +
            '\t\t' + '<link rel="stylesheet" href="./' + argv.feature + '.css">' + '\n' +
            '\t' + '</head>' + '\n' +
            '\t' + '<body>' + '\n' +
            '\t\t' + '<div class="' + argv.feature + '">' + '\n' +
            '\t\t\t' + '<h1>' + argv.feature + '</h1>' + '\n' +
            '\t\t' + '</div>' + '\n' +
            '\t' + '</body>' + '\n' +
            '</html>';

var scss =  '.' + argv.feature + ' {' + '\n' +
            '\t' + 'color: blue;' + '\n' +
            '\t' + "font-family: 'Open Sans', sans-serif; }";

const featDir = path.join(__dirname, '/public/' + argv.feature + '/'),
      sassDir = path.join(__dirname, '/scss/');

gulp.task('new', function () {
  mkdirp(featDir, function (err) {
    if (err) console.error(err)
  });
  fs.writeFile(featDir + argv.feature + '.html', html, null);
  fs.writeFile(sassDir + argv.feature + '.scss', scss, null);
});

gulp.task('sass', function () {
  gulp.src(SOURCE.scss)
    .pipe(sass())
    .pipe(gulp.dest(DEST.css))
    .pipe(browserSync.stream())
    ;
});

gulp.task('server', function (cb) {
  exec('node server.js ' + argv.feature + ' ', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('watch', ['sass'], function () {
  browserSync.init({
    proxy: 'localhost:3100/' + argv.feature + '/' + argv.feature + '.html'
  });
  gulp.watch(SOURCE.scss, ['sass']);
  gulp.watch("public/**/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['server', 'watch']);