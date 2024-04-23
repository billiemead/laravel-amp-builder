'use strict';

// Require
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var del = require('del');
var path = require('path');
var src = 'scripts/';
var tplPath = 'scripts/templates'; //must be same as fileManagerConfig.tplPath
var dst = 'public/assets/js/';
var jsFile = 'app.js';

gulp.task('clean', function (cb) {
  del(dst + '/*', cb);
});
//gulp.task('default', ['concat-uglify-js', 'requirejsBuild'/*, 'minify-css'*/]);
var jqueryUICores = [
	"/version",
	"/data",
	"/disable-selection",
	"/focusable",
	"/form",
	"/ie",
	"/keycode",
	"/labels",
	"/jquery-1-7",
	"/plugin",
	"/safe-active-element",
	"/safe-blur",
	"/scroll-parent",
	"/tabbable",
	"/unique-id",
	
];
jqueryUICores = jqueryUICores.map(function(value){
	return 'node_modules/jquery-ui/ui' + value + '.js';;
});
gulp.task('build',  function() {
	var landing_sources = [
		src + 'libraries/mdb-bootstrap/jquery-3.3.1.min.js',
		src + 'libraries/mdb-bootstrap/bootstrap.js',
		src + 'libraries/mdb-bootstrap/modules/enhanced-modals.js',
		src + 'libraries/mdb-bootstrap/modules/forms-free.js',
		src + 'libraries/mdb-bootstrap/modules/jquery.easing.js',
		src + 'libraries/mdb-bootstrap/modules/scrolling-navbar.js',
		src + 'libraries/mdb-bootstrap/modules/velocity.js',
		src + 'libraries/mdb-bootstrap/modules/waves.js',
		src + 'libraries/mdb-bootstrap/modules/wow.js',
    ];
	gulp.src(landing_sources)
    .pipe(concat('landingpage.js'))
    .pipe(gulp.dest(dst));
	
	return gulp.src(landing_sources)
    .pipe(concat('landingpage.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dst));
	gulp.src([
		'node_modules/jquery/dist/jquery.js',
		src + 'libraries/jquery-migrate.js',
    ])
    .pipe(concat('app_base.js'))
   // .pipe(uglify())
    .pipe(gulp.dest(dst));
	/*gulp.src([
		src + 'script.js',
    ])
    .pipe(gulp.dest(dst));*/
	/*return gulp.src([
    ])
	//.pipe(babel())
    .pipe(concat(jsFile))
    .pipe(uglify())
    .pipe(gulp.dest(dst));*/
});
var svgSprite = require('gulp-svg-sprite');
gulp.task('svg-sprite',  function() {
	gulp.src('scripts/modules/icons/*.svg')
	  .pipe(svgSprite())
	  .pipe(gulp.dest('public/assets/images/sprites'));
});