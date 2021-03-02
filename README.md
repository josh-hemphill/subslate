# subslate

A configurable template string replacement

<br />

<!-- cspell: disable bracketsstartstop -->

[![version](https://img.shields.io/github/v/tag/josh-hemphill/subslate?sort=semver&style=flat-square)](https://github.com/josh-hemphill/subslate/releases)
[![NPM](https://img.shields.io/static/v1?label=&message=NPM&color=informational&style=flat-square)](https://npmjs.org/package/subslate)
[![Deno](https://img.shields.io/static/v1?label=&message=Deno&color=informational&style=flat-square)](https://deno.land/x/subslate/mod.ts)
[![API doc](https://img.shields.io/static/v1?label=Deno&message=API-Doc&color=informational&style=flat-square)](https://doc.deno.land/https/deno.land/x/subslate/mod.ts)
<!-- [![docs](https://img.shields.io/static/v1?label=&message=Docs&color=informational&style=flat-square)](https://josh-hemphill.github.io/subslate/#/) -->
[![Build Status](https://img.shields.io/travis/josh-hemphill/subslate.svg?style=flat-square)](https://travis-ci.org/josh-hemphill/subslate)
[![Codecov](https://img.shields.io/codecov/c/github/josh-hemphill/subslate.svg?style=flat-square)](https://codecov.io/gh/josh-hemphill/subslate)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/subslate?label=Deps&style=flat-square)](https://libraries.io/npm/subslate)
[![Rate on Openbase](https://badges.openbase.io/js/rating/subslate.svg)](https://openbase.io/js/subslate?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

## Install

### Node.js & Browser

```bash
npm install subslate
```

```js
/* ES Module / Typescript */ import { subslate } from "subslate";
/* CommonJS */ const { subslate } = require("subslate");
```

### Deno

```js
import subslate from "https://deno.land/x/subslate/mod.ts"
```

### Import in HTML

```html
<script type="text/javascript" src="dist/subslate.js"></script> <!-- For UMD module -->
<script type="text/javascript" src="dist/subslate.poly.iife.js"></script> <!-- For global IIFE with polyfills -->
<script type="module" src="dist/subslate.esm.js"></script> <!-- For ES Module -->
```

### From CDN

```html
<script type="text/javascript" src="https://unpkg.com/subslate"></script>
```

## Examples

For a full list see the [examples directory](./example/) (coming)

### Play with it

[CodePen (suggested)](##) (coming soon)

[JSFiddle](##) (coming soon)

## Usage

Create a template with any kind of start and stop characters and configurable object path indicators; or by default just use JS style template characters (don't forget to escape them in a JS template if you want them there to replace later)

### Basic Usage

```js
import { subslate } from "subslate";

const template = '${A} world ${x["y"].0.z}'

const context = {A: 'hi', x:{y:[{z:', hello'}]}}

const compiled = subslate(template,context)

compiled === 'hi world, hello'
```

## Options

`subslate(template,context,options)`

  - [`options.startStopPairs`: `string | (string | [string, string])[]`](#with-custom-bracketsstartstop)
  - [`options.escapeSep`: `{[K in 'json' | 'html' | 'url' | 'js']?: boolean`](#with-escaped-object-property-indicators)
  - [`options.allowUnquotedProps`: `boolean`](#with-root-and-unquoted-brackets)
  - [`options.allowRootBracket`: `boolean`](#with-root-and-unquoted-brackets)
  - [`options.sanitizer`: `(v: SanitizerOptions) => string`](#with-sanitizer)
  - `options.maxNameLength`: `number` (maximum character length between start and stop)

### With Custom Brackets/Start-Stop

```js
import { subslate } from "subslate";

const template = `
SELECT * FROM ![tables.table]
`
const context = {tables: {table: 'myTable'}}

const compiled = subslate(template,context,{
  startStopPairs: ['![',']']
  // startStopPairs gets normalized to an array of pairs, so
  // ['![',']'] gets turned into [['![',']']]
  // and '||' would get turned into [['||','||']]
  // or even mixed ['||',['${','}']] = [['||','||'],['${','}']]
})
compiled === `
SELECT * FROM myTable
`
```

### With Escaped Object Property Indicators

```js
import { subslate } from "subslate";

const template = `
<p>
  <% x%5B%22y%22%5D\\u2E0&period;z %>
</p>
`

const context = {x:{y:[{z:'hello'}]}}

const compiled = subslate(template,context,{
  startStopPairs: ['<%','%>'],
  escapeSep: {
    json: true
    html: true
    url: true
    js: true
  }
})
compiled === `
<p>
  hello
</p>
`
```

### With Sanitizer

The sanitizer recieves all errors and empty fields as well as successful values. So you have a chance to to correct how you want the final string to be injected. A sanitizer must allways return a string, otherwise the library throws an error.

```ts
import { subslate } from "subslate";

const template = 'SELECT * FROM ${myTable}${blabla}'
const context = {myTable:'hello'}

type SanitizerOptions = {
  // If there was no characters between the start and stop
  isEmpty: boolean,

  // The full id that was between start and stop
  id: string,

  // The index in the id where parsing stopped if there was a problem
  at?: number,

  // The value that was successfully found for a givin id
  value?: unknown,
}

function sanitizer: string (opts: SanitizerOptions) {
  if (opts.isEmpty || opts.at !== undefined) return ''; // to silence errors from resulting in the stringified "undefined" being injected.
  return opts.value;
}

const compiled = subslate(template,context,{sanitizer})
compiled === 'SELECT * FROM hello'
```

### With Root and Unquoted Brackets

```js
import { subslate } from "subslate";

const template = `
<p>
  <% [x].y %>
</p>
`

const context = {x:{y:'hello'}}

const compiled = subslate(template,context,{
  startStopPairs: ['<%','%>'],
  allowUnquotedProps: true
  allowRootBracket: true
})
compiled === `
<p>
  hello
</p>
`
```

<!-- markdownlint-disable-next-line-->
## Reademe rewrite in progress...

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
