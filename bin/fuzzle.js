#!/usr/bin/env node

const gulp = require('gulp')
const gulpif = require('gulp-if')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const revDel = require('gulp-rev-delete-original')
const argv = require('minimist')(process.argv.slice(2))

const TARGET_ARG = 'dir'
const REMOVE_ARG = 'rm'
const DEFAULT_BUILD_FOLDER = './build'
const DEFAULT_SHOULD_REMOVE_ORIGINALS = true
const DEFAULT_MANIFEST_FILENAME = 'rev-manifest.json'

const revAssets = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const shouldRemoveOriginals = argv[REMOVE_ARG] || DEFAULT_SHOULD_REMOVE_ORIGINALS
  const mainfestPath = `${targetPath}/${DEFAULT_MANIFEST_FILENAME}`

  // TODO: add flag to ignore some files from being rev'd
  return gulp.src([
    `${targetPath}/**/*`,
    '!**/*.js',
    '!**/*.css',
    '!**/*.html',
    `!${DEFAULT_MANIFEST_FILENAME}`
  ])
    .pipe(rev())
    .pipe(gulpif(shouldRemoveOriginals, revDel()))
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest({
      path: mainfestPath,
      merge: true
    }))
    .pipe(gulp.dest('.'))
}

const revJS = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const shouldRemoveOriginals = argv[REMOVE_ARG] || DEFAULT_SHOULD_REMOVE_ORIGINALS
  const mainfestPath = `${targetPath}/${DEFAULT_MANIFEST_FILENAME}`

  return gulp.src(`${targetPath}/**/*.js`)
    .pipe(revRewrite({
      manifest: gulp.src(mainfestPath)
    }))
    .pipe(rev())
    .pipe(gulpif(shouldRemoveOriginals, revDel()))
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest({
      path: mainfestPath,
      merge: true
    }))
    .pipe(gulp.dest('.'))
}

const revCSS = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const shouldRemoveOriginals = argv[REMOVE_ARG] || DEFAULT_SHOULD_REMOVE_ORIGINALS
  const mainfestPath = `${targetPath}/${DEFAULT_MANIFEST_FILENAME}`

  return gulp.src(`${targetPath}/**/*.css`)
    .pipe(revRewrite({
      manifest: gulp.src(mainfestPath)
    }))
    .pipe(rev())
    .pipe(gulpif(shouldRemoveOriginals, revDel()))
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest({
      path: mainfestPath,
      merge: true
    }))
    .pipe(gulp.dest('.'))
}

const revHTML = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const mainfestPath = `${targetPath}/${DEFAULT_MANIFEST_FILENAME}`

  return gulp.src(`${targetPath}/**/*.html`)
    .pipe(revRewrite({
      manifest: gulp.src(mainfestPath)
    }))
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
