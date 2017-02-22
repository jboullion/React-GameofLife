var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

var sass = require('gulp-sass');
var babel = require('gulp-babel');

var bs = require('browser-sync').create();

var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

//Image Compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

//delete
var del = require('del');

//zip
var zip = require('gulp-zip');

//var less = require('gulp-less');
//var LessAutoprefixer = require('less-plugin-autoprefix');
//var lessAutoprefixer = new LessAutoprefixer({
//  browsers: ['last 2 versions']
//})
//var pump = require('pump'); //this is an error handling plugin. Not needed yet

//file paths
var THEME_PATH = 'public';
var SCRIPTS_PATH = 'src-files/scripts/**/*.js';
//var CSS_PATH = 'src-files/css/**/*.css';
var SCSS_PATH = 'src-files/scss/**/*.scss';
//var LESS_PATH = 'src-files/less/**/*.less';
//var TEMPLATES_PATH = 'src-files/templates/**/*.hbs';
var IMAGES_PATH = 'src-files/images/**/*.{jpg,png,jpeg,svg,gif}';

/**
 * SCSS/SASS task
 */
gulp.task('sass-styles', function() {
    console.log('Styling...');

    return gulp.src(SCSS_PATH)
        .pipe(plumber(function(err){
          //this function will run WHEN an error occurs in this task
          console.log('Styles Task Error');
          console.log(err);
          this.emit('end'); //this line will stop this task chain but continue running gulp
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: ['last 2 versions']
        }))
        .pipe(sass({
          outputStyle: 'compressed'
        })
          .on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename({
            basename: "live"
          }))
        .pipe(gulp.dest(THEME_PATH + '/css'))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
    console.log('Scripting...');

    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err){
          //this function will run WHEN an error occurs in this task
          console.log('Styles Task Error');
          console.log(err);
          this.emit('end'); //this line will stop this task chain but continue running gulp
        }))
        .pipe(babel({
          presets: ['es2015']
        }))
        //.pipe(uglify())
        .pipe(concat('live.js'))
		.pipe(sourcemaps.write())
        .pipe(gulp.dest(THEME_PATH + '/scripts'))
        .pipe(livereload());
});

// Images
gulp.task('images', function() {
    console.log('Imaging...');

    return gulp.src(IMAGES_PATH)
      .pipe(imagemin(
        [
          imagemin.gifsicle(),
          imagemin.jpegtran(),
          imagemin.optipng(),
          imagemin.svgo(),
          imageminJpegRecompress(),
          imageminPngquant(),
        ]
      ))
      .pipe(gulp.dest(THEME_PATH + '/images'));

});

//Clean workspace
/**
 * CRAZY DANGEROUS. DO NOT USE UNLESS YOU HAVE A VERY GOOD REASON.
 */
/*
gulp.task('clean', function(){
  console.log('Cleaning...');
  return del.sync([
    THEME_PATH+'/**', '!'+THEME_PATH //You have to explicitly ignore the parent directories. /** also matches parent directory
  ]);
});
*/

gulp.task('sync', function(){
  console.log('Syncing...');
  	bs.init({
    	proxy: "http://localhost/React/gameoflife/public/"
	});

	gulp.watch(THEME_PATH+"/**/*.*").on('change', bs.reload);
});

//Export src files to zip
gulp.task('export', function(){
  console.log('Exporting...');
  return gulp.src('src-files/**/*')
    .pipe(zip('website.zip'))
    .pipe(gulp.dest('./'));
});

// Default task, will run all common tasks at once
gulp.task('default', ['sass-styles','images','scripts', 'sync'], function() {
    console.log('Gulping...');

});

// Setup gulp dev server
gulp.task('watch', ['default'], function() {
    console.log('Watching you...');
    //require('./server'); //used only on node servers
    //livereload.listen(); //used only on node servers
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['sass-styles']);
    gulp.watch(IMAGES_PATH, ['images']);
});
