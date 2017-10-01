// gulp
const gulp = require('gulp');
const watch = require('gulp-watch');

// server, unless using express
// const devBuild = (process.env.NODE_ENV !== 'production');
// const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');

// UTILITIES
// passes through only src files which are newer than the dest files
const newer = require('gulp-newer');
// combines files into one
const concat = require('gulp-concat');
// notifications for gulp activities
const notify = require('gulp-notify');
// delete files and folders using globs
const del = require('del');
// allows for a callback when piping more than two streams together
const pump = require('pump');
// allows for merging and returning of two multiple src streams
const merge = require('gulp-merge');

// JS
// minifies js files
// const uglify = require('gulp-uglify'); does not support ES6
const babili = require('gulp-babili');
// using commonjs require in the browser
const browserify = require('browserify');
// converts bundle into type of stream that gulp expects
const source = require('vinyl-source-stream');

// LESS
// compiles less files
const less = require('gulp-less');
const minifycss = require('gulp-minify-css');
const lessGlob = require('less-plugin-glob');

const folders = {
  src: './src/',
  build: './dist/',
  build_public: './dist/public/',
  build_private: './dist/app/'
};

// gulp defaults
gulp.task('default', ['clean', 'server', 'watch'], function() {
  gulp.start('less', 'html', 'browserify', 'less-public', 'html-public', 'browserify-public', 'images-public')
});


gulp.task('server', function() {
  nodemon({
    'script': './server/server.js',
    'ignore': './public/js/*.js'
  });
});

gulp.task('watch', function() {
  livereload.listen();
  watch([
    `${folders.src}/less/**/*.less`, 
    `${folders.src}/components/**/*.less`,
    `!${folders.src}/public/**`
    ], function() { gulp.start('less'); });

  watch(`${folders.src}/public/**/*.less`, function() { gulp.start('less-public'); });

  watch([
    `${folders.src}/**/*.html`, 
    `!${folders.src}/public/**`
    ], function() { gulp.start('html'); });

  watch(`${folders.src}/public/**/*.html`, function() { gulp.start('html-public'); });

  watch([
    `${folders.src}/app.js`, 
    `${folders.src}/utilities/**/*.js`, 
    `${folders.src}/components/**/*.js`,
    `${folders.src}/models/**/*.js`
    ], function() { gulp.start('browserify'); });

  watch([
    `${folders.src}/public/auth.js`,
    `${folders.src}/public/**/*.js`
    ], function() { gulp.start('browserify-public'); });

  watch([
    `${folders.src}/public/img/**`
    ], function() { gulp.start('images-public'); });
});

// compile less
gulp.task('less', function() {
  return gulp.src([`${folders.src}/less/app.less`, `!${folders.src}/public/**`])
    .pipe(less({
      plugins: [lessGlob]
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(`${folders.build_private}/css`))
    .pipe(livereload())
    .pipe(notify({ message: 'LESS compiled successfully' }));
});

gulp.task('less-public', function() {
  return gulp.src(`${folders.src}/public/**/*.less`)
    .pipe(less({
      plugins: [lessGlob]
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(`${folders.build_public}/css`))
    .pipe(livereload())
    .pipe(notify({ message: 'LESS compiled successfully' }));
});

// migrate html
gulp.task('html', function() {
  return gulp.src([`${folders.src}/**/*.html`, `!${folders.src}/public/**`])
    .pipe(newer(`${folders.build_private}`))
    .pipe(gulp.dest(`${folders.build_private}/`))
    .pipe(livereload())
    .pipe(notify({ message: 'HTML moved to dev_build successfully' }));
});

gulp.task('html-public', function() {
  return gulp.src([`${folders.src}/public/**/*.html`])
    .pipe(newer(`${folders.build_public}`))
    .pipe(gulp.dest(`${folders.build_public}/`))
    .pipe(livereload())
    .pipe(notify({ message: 'HTML moved to dev_build successfully' }));
});

gulp.task('images-public', function() {
  return gulp.src(`${folders.src}/public/img/**`)
  .pipe(gulp.dest(`${folders.build_public}/img`))
  .pipe(notify({ message: 'Images moved successfully'}));
});


// bundle js files and minimize
// TODO: switch to commonjs via browserify for modules and builds
// gulp.task('js', function(cb) {
//   pump([
//     gulp.src([
//       `${folders.src}/app.js`,
//       `${folders.src}/utilities/**/*.js`,
//       `${folders.src}/components/**/*.js`]),
//     concat('app.js'),
//     // babili({
//     //   mangle: {
//     //     keepClassName: true
//     //   }
//     // }),
//     gulp.dest(`${folders.build_private}/js`),
//     livereload(),
//     notify({ message: 'JS compiled successfully' })
//     ],
//     cb
//   );
// });

gulp.task('browserify', function() {
  return browserify(`${folders.src}/app.js`)
    .bundle()
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest(`${folders.build_private}/js`))
    .pipe(livereload())
    .pipe(notify({ message: 'Browserify build successful' }));
});

gulp.task('browserify-public', function() {
  return browserify([`${folders.src}/public/auth.js`])
    .bundle()
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(source('auth.js'))
    .pipe(gulp.dest(`${folders.build_public}/js`))
    .pipe(livereload())
    .pipe(notify({ message: 'Browserify build successful' }));
});


gulp.task('serve', ['server', 'watch']);

// flush dist folders
gulp.task('clean', function() {
  return del(`${folders.build}/**/*`);
});