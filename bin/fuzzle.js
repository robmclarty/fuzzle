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
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${targetPath}/${DEFAULT_MANIFEST_ASSETS_NAME}`

  return gulp.src([
    `${ targetPath }/**/*`,
    '!**/*.js',
    '!**/*.css',
    '!**/*.html'
  ])
    .pipe(rev())
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest(manifestAssetsPath))
    .pipe(gulp.dest('.'))
}

const revJS = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${targetPath}/${DEFAULT_MANIFEST_ASSETS_NAME}`
  const manifestJSPath = `${targetPath}/${DEFAULT_MANIFEST_JS_NAME}`

  return gulp.src(`${targetPath}/**/*.js`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest(manifestJSPath))
    .pipe(gulp.dest('.'))
}

const revCSS = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${targetPath}/${DEFAULT_MANIFEST_ASSETS_NAME}`
  const manifestCSSPath = `${targetPath}/${DEFAULT_MANIFEST_CSS_NAME}`

  return gulp.src(`${targetPath}/**/*.css`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(rev())
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest(manifestCSSPath))
    .pipe(gulp.dest('.'))
}

const revHTML = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestAssetsPath = `${targetPath}/${DEFAULT_MANIFEST_ASSETS_NAME}`
  const manifestJSPath = `${targetPath}/${DEFAULT_MANIFEST_JS_NAME}`
  const manifestCSSPath = `${targetPath}/${DEFAULT_MANIFEST_CSS_NAME}`

  return gulp.src(`${targetPath}/**/*.html`)
    .pipe(revRewrite({ manifest: gulp.src(manifestAssetsPath) }))
    .pipe(revRewrite({ manifest: gulp.src(manifestCSSPath) }))
    .pipe(revRewrite({ manifest: gulp.src(manifestJSPath) }))
    .pipe(gulp.dest(targetPath))
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
