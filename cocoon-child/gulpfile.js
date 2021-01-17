const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sassImage = require('gulp-sass-image');
const postcss = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const packageImporter = require('node-sass-package-importer');
const notifier = require('node-notifier');
const plumber = require('gulp-plumber');
const header = require('gulp-header');
const config = {
  supportBrowsers: ['ios >= 7', 'android >= 4.4'],
  images: 'images/**/*.+(jpeg|jpg|png|gif|svg)',
  javascripts: ['src/**/*.js'],
  sass: ['sass/**/*.scss', 'sass/**/*.sass'],
};

const notify = (taskName, error) => {
  let title = `[task] ${taskName} ${error.plugin}`;
  let errorMsg = `error: ${error.messageFormatted}`;
  /* eslint-disable no-console */
  console.error(`${title}\n${error}`);
  notifier.notify({
    title: title,
    message: errorMsg,
  });
};

gulp.task('sass-image', () => {
  return gulp.src(config.images)
    .pipe(sassImage({
        targetFile: 'modules/_sass-image.scss',
        images_path: 'images/',
        css_path: 'dist/css/',
        includeData: false,
    }))
    .pipe(gulp.dest('sass'));
});

gulp.task('sass', () => {
  return gulp.src(
      ['sass/*.scss', 'sass/*.sass']
    )
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(sass({
      outputStyle: 'compressed',
      importer: packageImporter({
        extensions: ['.sass', '.scss', '.css']
      })
    }))
    .pipe(autoprefixer({browsers: config.supportBrowsers, add: true}))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .on('error', function handleError() {
      this.emit('end');
    })
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('minifyWebPackJS', () => {
  return gulp.src('dist/scripts/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('dist/min/'));
});

gulp.task('watch', () => {
  gulp.watch(config.javascripts, ['webpack']);
  gulp.watch('dist/scripts/*.js', ['minifyWebPackJS']);
  gulp.watch(config.images, ['sass-image']);
  gulp.watch(config.sass, ['sass']);
});

gulp.task('default', ['watch']);
