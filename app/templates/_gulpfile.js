/**
 * @file
 */

'use strict';

var gulp = require('gulp');
var phplint = require('phplint').lint;
var phpcs = require('gulp-phpcs');
var shell = require('gulp-shell'),
pdependDocs = './docs/pdepend';
var phpcbf = require('gulp-phpcbf');
var gutil = require('gutil');
var phpmd = require('gulp-phpmd');
var std = './vendor/drupal/coder/coder_sniffer/Drupal';


//seems to work
gulp.task('phplint', function (cb) {
    phplint(['./**/*.php', './**/*.module', './**/*.inc', '!node_modules/**/*', '!vendor/**/*'],  { limit: 20 }, function (err, stdout, stderr) {
      if (err) {
          cb(err);
      }
      else {
          cb();
      }
    });
});

//seems to work - saving now
gulp.task('phpcs', function () {
    return gulp.src(['./**/*.php', './**/*.module', './**/*.inc', '!node_modules/', '!vendor/**/*'])
        .pipe(phpcs({
            bin: 'vendor/bin/phpcs',
            standard: std,
            warningSeverity: 0
        }))
          .pipe(phpcs.reporter('log'));
});


//seems to work, but not a 100% sure
gulp.task('phpcbf', function () {
	return gulp.src(['./**/*.php', './**/*.module', './**/*.inc', '!node_modules/', '!vendor/**/*'])
	    .pipe(phpcbf({
	        bin: 'vendor/bin/phpcbf',
	        standard: std,
	        warningSeverity: 0
	    }))
	      .on('error', gutil.log)
	      .pipe(gulp.dest('phpfixed'));
});


//Writing this without any special config because there is an xml config doc
//seems to work
gulp.task('phpdoc', shell.task(['./vendor/bin/phpdoc']));


//nope
gulp.task('pdepend',
        shell.task(
                ['mkdir -p ' + pdependDocs,
                 './vendor/bin/pdepend --summary-xml=' + pdependDocs + '/summary.xml --jdepend-chart=' + pdependDocs + '/chart.svg --overview-pyramid=' + pdependDocs + '/pyramid.svg --ignore=vendor,node_modules,test.php --suffix=php,inc,modules .'
        ]));


//works, but not setup for Drupal, so kind of pointless...
gulp.task('phpmd', function () {
    return gulp.src(['./**/*.php', './**/*.module', './**/*.inc', '!node_modules/', '!vendor/**/*', '!./**/test.php'])
        // Validate code using PHP Mess Detector
        .pipe(phpmd({
            bin: 'vendor/bin/phpmd',
            ruleset: 'cleancode,codesize,controversial,design,naming,unusedcode',
            format: 'text',
        }))
    	// Log all problems that was found
        .on('error', console.error)
        //.pipe(phpmd.reporter('log'));
});


gulp.task('watch', function () {
    gulp.watch(['composer.json', './**/*.php', './**/*.modules', './**/*.inc', '!vendor/**/*', '!node_modules/**/*'], function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    // gulp.watch('composer.json', ['dump-autoload']);.
    gulp.watch(['./**/*.php', './**/*.modules', './**/*.inc', '!vendor/**/*', '!node_modules/**/*', '!test.php'], ['phplint', 'phpcs']);
});


gulp.task('default', ['phplint', 'phpcs', 'phpcbf', 'phpdoc', 'watch']);
