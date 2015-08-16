/*jslint node: true */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ghPages = require('gulp-gh-pages');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var size = require('gulp-size');
var source = require('vinyl-source-stream');
var sequence = require('run-sequence');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var config = {
  fileSaver: {
    scripts: './src/*.js',
  },
  docs: {
    src: './docs/src',
    index: './docs/index.html',
    styles: './docs/assets/stylesheets/**/*.css',
    dest: './docs/dist'
  },
  browserSync: {
    port: '3000',
    server: './docs'
  },
  // Predefined browserify configs to keep tasks DRY
  browserify: {
    fileSaver: {
      type: 'dragular',
      entryPoint: './src/file-saver.js',
      bundleName: 'angular-file-saver.js',
      dest: './dist',
    },
    docs: {
      type: 'docs',
      entryPoint: './docs/assets/js/custom.js',
      bundleName: 'examples.js',
      dest: './docs/dist'
    }
  },
  // A flag attribute to switch modes.
  isProd: false
};

var browserifyDefaults = config.browserify.fileSaver;

function handleErrors(err) {
  gutil.log(err.toString());
  this.emit('end');
}

/*
* See http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
*/
function buildScript() {

  var bundler = browserify({
    entries: browserifyDefaults.entryPoint,
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: false
  }, watchify.args);

  // Watch files for changes and only rebuilds what it needs to
  if (!config.isProd) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      rebundle();
    });
  }

  function rebundle() {
    var stream = bundler.bundle();

    return stream.on('error', handleErrors)
      .pipe(source(browserifyDefaults.bundleName))
      .pipe(buffer())
      .pipe(gulp.dest(browserifyDefaults.dest))
      .pipe(gulpif(config.isProd, $.uglify({
        compress: { drop_console: true }
      })))
      .pipe(gulpif(config.isProd, rename({
        suffix: '.min'
      })))
      .pipe(size({
        title: 'Scripts: '
      }))
      .pipe(gulp.dest(browserifyDefaults.dest));
  }

  return rebundle();
}

gulp.task('browserify', function() {
  return buildScript();
});

gulp.task('styles:docs', function() {

  return gulp.src([
    config.docs.styles
  ])
  .pipe(concat('examples.css'))
  .pipe(gulp.dest(config.docs.dest));
  // .pipe(gulpif(browserSync.active, browserSync.stream()));
});

gulp.task('deploy', function() {
  return gulp.src('./docs/**/*')
    .pipe(ghPages());
});

gulp.task('build', function() {
  config.isProd = true;
  browserifyDefaults = config.browserify.fileSaver;

  sequence(['browserify']);
});

gulp.task('build:docs', function() {
  config.isProd = true;
  browserifyDefaults = config.browserify.docs;

  sequence(['browserify', 'styles:docs']);
});

gulp.task('watch:docs', ['serve'], function() {
  gulp.watch(config.docs.styles,  ['styles:docs']);
  gulp.watch(config.docs.templates,  ['templates:docs']);
});

gulp.task('default', ['build']);
