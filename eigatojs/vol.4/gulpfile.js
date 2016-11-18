var gulp            = require('gulp');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var $               = require('gulp-load-plugins')();
// var del             = require('del');
var runSequence     = require('run-sequence');



// SASS Build task
gulp.task('sass', function() {
  return gulp.src(['src/**/css/**/*.scss'],{base: 'src'})
    .pipe($.plumber())
    .pipe($.cached('sass'))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .on('error', function(err){
      $.notify.onError({
        title: 'SASS Failed',
        message: 'Error(s) occurred during compile!'
      });
      console.log(err.message);
    })
    .pipe($.autoprefixer('last 6 version'))
    .pipe($.csscomb())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('src'))
    .pipe(reload({
      stream: true
    }))
    .pipe($.notify({
      message: 'css task complete'
    }));
});



// A cache does SASS file at the time of the first practice
gulp.task('sass-cache', function() {
  return gulp.src(['src/**/css/**/*.scss'],{base: 'src'})
    .pipe($.plumber())
    .pipe($.cached('sass'))
});

// reload all Browsers
gulp.task('bs-reload', function() {
  console.log('reload')
  browserSync.reload();
});


// start webserver
gulp.task('server', function(done) {
  return browserSync({
    port: 3001,
    server: {
      baseDir: './src/'
    }
  }, done);
});

// start webserver from dest folder to check how it will look in production
gulp.task('server-prod', function(done) {
  return browserSync({
    port: 3002,
    server: {
      baseDir: './dest/'
    }
  }, done);
});


/************************************
 for release task
*************************************/
// delete build folder
gulp.task('clean:build', function (cb) {
  return gulp.src(['dest/*'], {read: false})
    .pipe($.clean());
});

// copy HTML
gulp.task('copy-html', function() {
  return gulp.src(['src/**/*.html'],{base: 'src'})
    .pipe(gulp.dest('dest'));
});

// minify HTML
gulp.task('minify-html', function() {
  var opts = {
    comments: false,
    spare: true,
    conditionals: true
  };

  return gulp.src(['src/**/*.html'],{base: 'src'})
    .pipe($.minifyHtml(opts))
    .pipe(gulp.dest('dest'));
});


// SASS Build task for release
gulp.task('sass:build', function() {
  var s = $.size();
  return gulp.src(['src/**/css/**/*.scss'],{base: 'src'})
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      style: 'expanded'
    }))
    .pipe($.autoprefixer('last 6 version'))
    .pipe($.csscomb())
    .pipe($.minifyCss({
      keepBreaks: true,
      aggressiveMerging: false,
      advanced: false
    }))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dest'))
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total CSS size ' + s.prettySize;
      }
    }));
});

// copy css
gulp.task('copy-css', function() {
  return gulp.src(['src/**/css/**/*.css'],{base: 'src'})
    .pipe(gulp.dest('dest'));
});

// optimize img
gulp.task('optimize-img', function() {
  return gulp.src(['src/**/img/**/*.+(jpg|jpeg|png|gif|svg)'],{base: 'src'})
    .pipe($.changed('dest/**/img/'))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dest'));
});

// minify JS
gulp.task('minify-js', function() {
  return gulp.src(['src/**/js/**/*.js','!src/**/js/**/*.min.js'],{base: 'src'})
    .pipe($.stripDebug())
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dest'));
});

// copy js
gulp.task('copy-js', function() {
  return gulp.src(['src/**/js/**/*.js','src/**/js/**/*.json'],{base: 'src'})
    .pipe(gulp.dest('dest'));
});
gulp.task('copy-json', function() {
  return gulp.src(['src/**/*.json'],{base: 'src'})
    .pipe(gulp.dest('dest'));
});

// calculate build folder size
gulp.task('build:size', function() {
  var s = $.size();
  return gulp.src('./dest/**/*.*')
    .pipe(s)
    .pipe($.notify({
      onLast: true,
      message: function() {
        return 'Total build size ' + s.prettySize;
      }
    }));
});


/************************************
 for style guide
*************************************/
var frontnote = require("gulp-frontnote");
gulp.task('styleguide', function() {
  return gulp.src(['src/**/css/*.scss'],{base: 'src'})
    .pipe(frontnote({

          title:'スタイルガイド',
          overview: './overview.md',
          // template: './my-template',
          // includeAssetPath: 'assets/**/*'
          out: './doc'
      }));
});


// default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['server','sass-cache'], function() {
    gulp.watch('css/*.css', function(file) {
      if (file.type === "changed") {
        browserSync.reload(file.path);
      }
    });
    gulp.watch(['src/**/*.html', 'src/**/views/*.html'], ['bs-reload']);
    gulp.watch('src/**/js/*.js', ['bs-reload']);
    gulp.watch('src/**/css/*.scss', ['sass']);
});


/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css
 * 3. copy and minimize images
 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 *
 */
gulp.task('build', function(callback) {
  runSequence(
    'clean:build',
    'copy-css',
    'copy-html',
    'copy-js',
    'copy-json',
    // 'minify-js',
    'sass:build',
    'optimize-img',
    'build:size',
    callback);
});
