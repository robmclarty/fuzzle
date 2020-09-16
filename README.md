# Fuzzle

![Fuzzle](./fuzzle.png)

CLI for static asset revisioning and reference updating (e.g., creates a copy of
`zebra.png` as `zebra-1d95e638e8.png`).

Inspects `.js`, `.css`, and `.html` files and will update all references to
any renamed static assets to the corresponding hashed filenames.


## Install

`$ npm install fuzzle --save-dev`


## Usage

`$ npx fuzzle rev --dir ./my-static-assets`


## Options

### `--dir`

The folder containing all the static assets you want to revision. This would
usually be a build target folder that contains all your processed/transpiled
assets like JS, CSS, HTML, images, fonts, etc.

Defaults to `./build`.

### `--clean`

Indicate whether (or not) you would like the original asset files (the
non-revisioned versions without the hash in the filename) to be removed.

Defaults to `true`.

If you don't want the originals removed pass `--clean false`.

## Commands

### `rev`

Probably what you'll want to use most of the time: revisions all asset files and
rewrites their references in any html, js, and css files.

It does this by creating a manifest file which maps the regular filename to the
revisioned filenames, replacing references of the one to the other.

### `revision`

Revisions all files. Ignores any `.html` files, `favicon.ico`, and `site.webmanifest`.

### `rewrite`

Updates all references in any html, js, or css files to files in the manifest
file.


## License

MIT
