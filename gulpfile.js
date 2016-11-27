var fileinclude = require('gulp-file-include');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var reload = browserSync.reload;
var size = require('gulp-size');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

gulp.task('fileinclude', function() {
  gulp.src([
    '**/*.html',
    '!built',
    '!built/**',
    '!dist',
    '!dist/**',
  ])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest('./built/'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('reloadme', [], function(done) {
  browserSync.reload();
  done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['fileinclude'], function() {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./built/"
    }
  });

  gulp.watch(['**/*.html',
    '!built',
    '!built/**'
  ], ['fileinclude', 'reloadme']);
});

gulp.task('js', function () {
  // returns a Node.js stream, but no handling of error messages
  return gulp.src('built/**.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
  return gulp.src('built/**/**.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  gulp.src('built/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('lint', function() {
  return gulp.src('built/**.js').pipe(eslint())
  .pipe(eslint.format())
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});

var autoprefixer = require('gulp-autoprefixer');

gulp.task('minify-css', function() {
  return gulp.src('built/**.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

var del = require('del');

gulp.task('clean', function () {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('fonts', function() {
  return gulp.src('built/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest('.tmp/fonts'))
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', function() {
  gulp.start('fileinclude');
});

gulp.task('build', [
  'lint',
  'clean',
  'html',
  'js',
  'images',
  'fonts',
  'minify-css'
],
function() {
  return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true}));
});
