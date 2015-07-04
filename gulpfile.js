var gulp = require('gulp');
var jade = require('gulp-jade');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var del = require('del');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
    runSequence('clean',
                ['scripts', 'jade', 'sass', 'images', 'favicon'],
                'css',
                'cleanupTempFiles',
                cb);
});

// Compile javascript into a single bundle
gulp.task('scripts', function() {
    return gulp.src([
        'app/bower_components/jquery/dist/jquery.min.js',
        'app/bower_components/jquery.validation/dist/jquery.validate.min.js',
        'app/bower_components/jquery.scrollTo/jquery.scrollTo.min.js',
        'app/bower_components/jquery.localScroll/jquery.localScroll.min.js',
        'app/scripts/main.js',
    ])
        .pipe(concat({ path: 'bundle.js' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
})

// Compile jade templates into static html
gulp.task('jade', function() {
    return gulp.src('app/templates/index.jade')
        .pipe(jade())
        .pipe(gulp.dest('dist/'));
});

// Compile sass/compass into a single .css file
gulp.task('sass', function() {
    return gulp.src('app/styles/*.scss')
        .pipe(compass({
            sass: 'app/styles',
            css: 'app/styles',
            image: 'app/images',
            require: ['modular-scale'],
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/styles'));
});

// concatenate css into a single file
gulp.task('css', function() {
    return gulp.src(['app/bower_components/normalize-css/normalize.css', 'dist/styles/main.css'])
        .pipe(concatCss('bundle.css', {
            inlineImports: false,
            rebaseUrls: false,
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/styles'));
});

// Copy image assets to the dist directory
gulp.task('images', function() {
    return gulp.src('app/images/*')
        .pipe(gulp.dest('dist/images'));
});

// Copy favicon across to dist directory
gulp.task('favicon', function() {
    return gulp.src('app/favicon.ico').pipe(gulp.dest('dist'));
});

gulp.task('cleanupTempFiles', function(cb) {
    del([
        'dist/styles/main.css',
        'app/styles/main.css'
    ], cb)
});

// Cleanup previous build files
gulp.task('clean', function(cb) {
    del(['dist/**/*'], cb);
});
