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

The folder containing all the static assets you want to rev. This would usually
be a build target folder that contains all your processed/transpiled assets
like JS, CSS, HTML, images, fonts, etc.

Defaults to `./build`.

## Commands

### `rev`

Probably what you'll want to use most of the time, runs all the following
commands in sequence so that first, all rev'd files have been created, it will
go through each of JS, CSS, and HTML files and update any file references that
correspond to the rev'd files. It does this by creating manifest files which
map the regular filename to the rev'd filename, replacing references of the one
to the other.

### `rev:assets`

Revs all files which are not JS, CSS, or HTML in the target directory.

### `rev:js`

Revs all JS files in the target directory and updates any references contained
within them to any other rev'd static assets (but not CSS or HTML).

### `rev:css`

Revs all CSS files in the target directory and updates any references contained
within them to any other rev'd static assets (but not JS or HTML).

### `rev:html`

Revs all HTML files in the target directory and updates any references contained
within them to any other rev'd static assets (including JS + CSS).

## License

MIT
