const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const concatCss = require('gulp-concat-css');

gulp.task('browserify', function() {
    return browserify({ entries: ['src/js/index.js'] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('babel', () =>
    gulp.src('dist/app.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
);

gulp.task('concatStyles', function () {
    return gulp.src('src/css/*.css')
      .pipe(concatCss("style.css"))
      .pipe(gulp.dest('dist')); 
});


gulp.task('default', ['concatStyles', 'browserify', 'babel']);