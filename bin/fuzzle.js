#!/usr/bin/env node

const gulp = require('gulp')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const argv = require('minimist')(process.argv.slice(2))

const TARGET_ARG = 'dir'
const DEFAULT_BUILD_FOLDER = './build'
const DEFAULT_MANIFEST_ASSETS_NAME = 'rev-manifest-assets.json'
const DEFAULT_MANIFEST_JS_NAME = 'rev-manifest-js.json'
const DEFAULT_MANIFEST_CSS_NAME = 'rev-manifest-css.json'

const revAssets = argv => {
  const inputPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`

  return gulp.src([
    `${ inputPath }/**/*`,
    '!**/*.js',
    '!**/*.css',
    '!**/*.html'
  ])
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(rev.manifest(manifestAssetsPath))
    .pipe(gulp.dest('.'))
}

const revJS = argv => {
  const inputPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestJSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_JS_NAME }`

  return gulp.src(`${ inputPath }/**/*.js`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(rev.manifest(manifestJSPath))
    .pipe(gulp.dest('.'))
}

const revCSS = argv => {
  const inputPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestCSSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_CSS_NAME }`

  return gulp.src(`${ inputPath }/**/*.css`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(inputPath))
    .pipe(rev.manifest(manifestCSSPath))
    .pipe(gulp.dest('.'))
}

const revHTML = argv => {
  const inputPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_ASSETS_NAME }`
  const manifestJSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_JS_NAME }`
  const manifestCSSPath = `${ DEFAULT_BUILD_FOLDER }/${ DEFAULT_MANIFEST_CSS_NAME }`

  return gulp.src(`${ inputPath }/**/*.html`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(revRewrite({ manifest: gulp.src(manifestCSSPath) }))
    .pipe(revRewrite({ manifest: gulp.src(manifestJSPath) }))
    .pipe(gulp.dest(inputPath))
}

const revAll = argv => {
  return gulp.series(
    () => revAssets(argv),
    gulp.parallel(
      () => revJS(argv),
      () => revCSS(argv)
    ),
    () => revHTML(argv)
  )()
}

const tasks = {
  'rev': revAll,
  'rev:assets': revAssets,
  'rev:js': revJS,
  'rev:css': revCSS,
  'rev:html': revHTML
}

const action = argv._[0]

if (!Object.keys(tasks).includes(action)) throw Error(`There is no task called '${action}'`)

tasks[action](argv)
