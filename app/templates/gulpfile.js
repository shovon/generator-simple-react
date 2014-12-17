var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var runsequence = require('gulp-run-sequence');
var ncp = require('ncp').ncp;
var gutil = require('gulp-util');

// Just some directories that we will be providing to `gulp.src` method calls.
var paths = {
  less: ['src/**/*.less', '!src/{style,style/**}'],
  css: ['build/**/*.css', '!build/{style,style/**}'],
  globalcss: ['build/style/*.css'],
  style: ['src/style/*.less'],
  appjs: ['./src/app.jsx'],
  js: ['src/**/*.js'],
  indexhtml: ['./src/index.html']
};

// Here is where we will be sending all our files to.
var destPath = './build'

/*
 * Handles an error event.
 */
function swallowError(error) {
  gutil.log(error);
  this.emit('end');
}

/*
 * Clears out all the stuff that have been generated during development.
 */
gulp.task('clean', function(done) {
  del(['build'], done);
});

/*
 * Compiles all LESS style sheets that are "local" to specific modules.
 */
gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'src') ]
    }))
    .on('error', swallowError)
    .pipe(gulp.dest(destPath));
});

/*
 * Compiles the global styles (all written in LESS).
 */
gulp.task('style', function () {
  return gulp.src(paths.style)
    .pipe(less({
      paths: [ path.join(__dirname, 'src', 'style') ]
    }))
    .on('error', swallowError)
    .pipe(gulp.dest(path.join(destPath, 'style')));
});

/*
 * Bundles the scripts, using Browserify.
 */
gulp.task('js', function() {
  return browserify(paths.appjs)
    .transform(reactify)
    .bundle()
    .on('error', function (err) {
      gutil.log(err);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .on('error', swallowError)
    .pipe(gulp.dest(destPath));
});

/*
 * Copies the index.html from the source directory to the build directory.
 */
gulp.task('copy-index', function () {
  return gulp
    .src(paths.indexhtml)
    .pipe(gulp.dest(destPath));
});

/*
 * Injects the "global" styles.
 */
gulp.task('inject-index', function () {
  return gulp
    .src([ path.join(destPath, 'index.html') ])
    .pipe(
      inject(
        gulp.src(paths.globalcss, {read: false}),
        {name: 'global', relative: true}
      )
    )
    .pipe(
      inject(gulp.src(paths.css, {read: false}), {relative: true})
    )
    .pipe(gulp.dest(destPath));
});

/*
 * Copies the index.html from the source directory to the build directory, and
 * injects link tags into the HTML.
 */
gulp.task('index', function (done) {
  return runsequence('copy-index', 'inject-index', done);
});

/*
 * Compiles the global styles, local styles, and the JavaSript/JSX code, and
 * puts the compiled code into the `build` folder. Injects the necessary
 * dpeendencies into the HTML.
 */
gulp.task('build', function (done) {
  return runsequence(
    'clean',
    ['style', 'less', 'js'],
    'index',
    done
  );
});

/*
 * Compiles the local LESS styles and updates the index.
 */
gulp.task('less-and-index', function (done) {
  return runsequence('less', 'index', done);
});

/*
 * Compiles the global LESS styles and updates the index.
 */
gulp.task('style-and-index', function (done) {
  return runsequence('style', 'index', done);
});

/*
 * Watch for changes in files.
 */
gulp.task('watch', function() {
  gulp.watch(paths.style, ['style-and-index']);
  gulp.watch(paths.less, ['less-and-index']);
  gulp.watch(paths.js.concat(paths.appjs), ['js']);
  gulp.watch(paths.indexhtml, ['index']);
});

/*
 * Run the server.
 */
gulp.task('server', ['watch'], function () {
  return gulp.src(destPath)
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

/*
 * The default is meant for development. Watches for changes, runs the builds,
 * and fires up a web server. Also opens a new browser tab to the application.
 */
gulp.task('default', function () {
  return runsequence('build', ['watch', 'server']);
});