var fileinclude = require('gulp-file-include'),
    gulp = require('gulp');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('fileinclude', function() {
    gulp.src([
            '**/*.html',
            '!built',
            '!built/**',
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



gulp.task('default', () => {
    gulp.start('fileinclude');
});