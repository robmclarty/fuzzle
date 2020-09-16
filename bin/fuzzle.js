#!/usr/bin/env node

const gulp = require('gulp')
const gulpif = require('gulp-if')
const del = require('del')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const revDel = require('gulp-rev-delete-original')
const argv = require('minimist')(process.argv.slice(2))

const TARGET_ARG = 'dir'
const REMOVE_ARG = 'clean'
const DEFAULT_BUILD_FOLDER = './build'
const DEFAULT_SHOULD_CLEAN = true
const MANIFEST_FILENAME = 'rev-manifest.json'

const revision = argv => {
  const shouldClean = argv[REMOVE_ARG] || DEFAULT_SHOULD_CLEAN
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestPath = `${targetPath}/${MANIFEST_FILENAME}`

  return gulp.src([
    `${targetPath}/**/*`,
    `!${manifestPath}`,
    '!**/*.html',
    `!${targetPath}/site.webmanifest`,
    `!${targetPath}/favicon.ico`
  ])
    .pipe(rev())
    .pipe(gulpif(shouldClean, revDel()))
    .pipe(gulp.dest(targetPath))
    .pipe(rev.manifest({
      base: targetPath,
      path: manifestPath,
      merge: true
    }))
    .pipe(gulp.dest(targetPath))
}

const rewrite = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestPath = `${targetPath}/${MANIFEST_FILENAME}`
  const manifest = gulp.src(manifestPath)

  return gulp.src([
    `${targetPath}/**/*.{html,js,css}`
  ])
    .pipe(revRewrite({
      manifest
    }))
    .pipe(gulp.dest(targetPath))
}

const removeManifest = argv => {
  const targetPath = argv[TARGET_ARG] || DEFAULT_BUILD_FOLDER
  const manifestPath = `${targetPath}/${MANIFEST_FILENAME}`

  return del(manifestPath)
}

const all = argv => {
  return gulp.series(
    () => revision(argv),
    () => rewrite(argv),
    () => removeManifest(argv)
  )()
}

const tasks = {
  'rev': all,
  'revision': revision,
  'rewrite': rewrite,
  'removeManifest': removeManifest
}

const action = argv._[0]

if (!Object.keys(tasks).includes(action)) throw Error(`There is no task called '${action}'`)

tasks[action](argv)
