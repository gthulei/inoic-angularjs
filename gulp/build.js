'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jsonminify = require('gulp-jsonminify');
var base64 = require('gulp-base64');
var sw = require('gulp-sw-cache');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'dfdApp',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.sourcemaps.init())
    .pipe($.cssnano())
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('htmlmin', function () {
  return gulp.src(path.join(conf.paths.src, '/assets/templates/**/*.html'))
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/templates')))
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src + '/assets/templates', '/**/*'), // do copy in htmlmin
    path.join('!' + conf.paths.src + '/assets/images', '/**/*'), // do copy in imagemin
    path.join('!' + conf.paths.src + '/assets', '/**/*.json'), // do copy in jsonmin
    path.join('!' + conf.paths.src + '/app', '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('imagemin', function () {
  return gulp.src([path.join(conf.paths.src, '/assets/images/**/*')])
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/images')));
});

gulp.task('jsonminify', function() {
  return gulp.src([path.join(conf.paths.src, '/assets/**/*.json')])
    .pipe(jsonminify())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets')));
});

gulp.task('base64', ['html'], function() {
  return gulp.src([path.join(conf.paths.dist, '/styles/app-*.css')])
    .pipe(base64({
      baseDir: conf.paths.dist,
      extensions: ['png', /\.jpg#datauri$/i],
      exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
      maxImageSize: 3*1024, // bytes 
      debug: true
    }))
    .pipe(gulp.dest(path.join(conf.paths.dist, 'styles')));
});

gulp.task('offline', function() {
  return gulp.src([
      path.join(conf.paths.dist, '/**/*'),
      path.join('!' + conf.paths.dist + '/maps', '/**/*'),
      path.join('!' + conf.paths.dist + '/fonts', '/**/ionicons.*'),
      path.join('!' + conf.paths.dist + '/assets/images', '/**/*')
    ])
    .pipe(sw({
      versionPrefix: 'dfdApp',
      include: ['fonts/ionicons.ttf?v=2.0.1', 'fonts/ionicons.woff?v=2.0.1']
    }))
    .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['html', 'fonts', 'other', 'htmlmin', 'imagemin', 'jsonminify', 'base64'], function() {
  gulp.start('offline');
});
