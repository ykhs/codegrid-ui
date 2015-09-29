'use strict';

var es           = require( 'event-stream' );
var del          = require( 'del' );
var browserSync  = require( 'browser-sync' ).create();
var reload       = browserSync.reload;

var gulp         = require( 'gulp' );
var autoprefixer = require( 'gulp-autoprefixer' );
var concat       = require( 'gulp-concat' );
var consolidate  = require( 'gulp-consolidate' );
var iconfont     = require( 'gulp-iconfont' );
var minifyCSS    = require( 'gulp-minify-css' );
var plumber      = require( 'gulp-plumber' );
var rename       = require( 'gulp-rename' );
var sass         = require( 'gulp-sass' );
var uglify       = require( 'gulp-uglify' );
var watch        = require( 'gulp-watch' );

var runSequence  = require( 'run-sequence' ).use( gulp );

gulp.task( 'browser-sync', function () {

  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  } );

} );

gulp.task( 'clean', function () {

  del( './build/' );

} );

gulp.task( 'copy-font', function () {

  return gulp.src( [
          './src/font/zero-width.eot',
          './src/font/zero-width.otf',
          './src/font/zero-width.svg',
          './src/font/zero-width.ttf',
          './src/font/zero-width.woff'
         ] )
         .pipe( gulp.dest( './build/font/' ) );

} );

gulp.task( 'copy-img', function () {

  return gulp.src( [
          './src/img/*/**'
         ] )
         .pipe( gulp.dest( './build/img/' ) );

} );

gulp.task( 'js', function () {

  return gulp.src( [
          './src/js/vendor/prism.js',
          './src/js/CG2-drawer.js',
          './src/js/CG2-compactNav.js',
          './src/js/CG2-searchOption.js'
         ] )
         .pipe( plumber() )
         .pipe( concat( 'codegrid-ui.js' ) )
         .pipe( gulp.dest( './build/js/' ) )
         .pipe( uglify() )
         .pipe( rename( { extname: '.min.js' } ) )
         .pipe( gulp.dest( './build/js/' ) );

} );


gulp.task( 'sass', function () {

  return gulp.src( './src/scss/codegrid-ui.scss' )
         .pipe( sass( { bundleExec: true } ) )
         .pipe( gulp.dest( './build/css/' ) )
         .pipe( rename( { extname: '.min.css' } ) )
         .pipe( minifyCSS() )
         .pipe( gulp.dest( './build/css/' ) );

} );


gulp.task( 'iconfont', function () {

  var fontName = 'codegrid-icon';

  return gulp.src( [ './src/font/codegrid-icon/*.svg' ] )
  .pipe( iconfont( {
    fontName: fontName,
    appendCodepoints: true
  } ) )
  .on( 'codepoints', function( codepoints, options ) {

    gulp.src( './src/font/codegrid-icon/_icon.scss' )
    .pipe( consolidate( 'underscore', {
      glyphs: codepoints,
      fontName: fontName,
      fontPath: '../font/',
      prefix: 'CG2-icon'
    } ) )
    .pipe( gulp.dest( './src/scss/' ) );

  } )
  .pipe( gulp.dest( './build/font/' ) );

} );


gulp.task( 'watch', function () {

  // watch( [ './**/*.html' ], function () {
  //   runSequence( browserSync.reload );
  // } );

  watch( [ './src/js/*.js' ], function () {
    runSequence( 'js', browserSync.reload );
  } );

  watch( [ './src/css/*.scss' ], function () {
    runSequence( 'sass', browserSync.reload );
  } );

  // watch( [ './src/font/codegrid-icon/*.svg' ], function () {
  //   runSequence( 'iconfont', 'sass', browserSync.reload );
  // } );

} );

gulp.task( 'default', function( callback ) {

  runSequence( 'browser-sync', 'iconfont', 'copy-font', 'copy-img', 'js', 'sass', 'watch', callback );

} );

gulp.task( 'build', function( callback ) {

  runSequence( 'clean', 'iconfont', 'copy-font', 'copy-img', 'js', 'sass', callback );

} );

