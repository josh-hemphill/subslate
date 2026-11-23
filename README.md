# Subslate

Replace placeholders in a template string with values from objects and arrays.
Subslate is a zero-dependency ES module for Node.js and modern browsers.

## Install

```sh
npm install subslate
```

```js
import { subslate } from 'subslate';
```

Subslate 2 requires Node.js 22.13 or newer. The package also exports
`subslate` as its default export.

When the JSR release is available, you can install the same API from
`@josh-hemphill/subslate`.

```sh
pnpm add jsr:@josh-hemphill/subslate
```

```js
import { subslate } from '@josh-hemphill/subslate';
```

### Browser

For a browser without a bundler, serve the package's
`dist/subslate.esm.js` as a module. Use `dist/subslate.js` for a classic
script that exposes `globalThis.subslate.subslate`. The npm package's
default unpkg URL serves the classic script.

```html
<script type="module">
	import { subslate } from './subslate.esm.js';
	console.log(subslate('Hello ${name}', { name: 'world' }));
</script>
```

## Usage

Subslate defaults to JavaScript-style delimiters and supports nested
object and array paths.

```js
import { subslate } from 'subslate';

const template = '${A} world ${x["y"].0.z}';
const context = { A: 'hi', x: { y: [{ z: ', hello' }] } };

subslate(template, context); // 'hi world, hello'
```

### Options

- `startStopPairs` accepts a symmetric delimiter string, a two-string
  start/end pair, or a list of strings and pairs. A bare two-string array
  is treated as one start/end pair.
- `escapeSep` enables `json`, `html`, `url`, or `js` escape forms in
  object path separators.
- `allowUnquotedProps` permits unquoted keys inside brackets.
- `allowRootBracket` permits a path to start with bracket notation.
- `maxNameLength` sets the maximum path length and defaults to 256.
- `sanitizer` receives the placeholder ID and its resolved value or
  missing-value details, then returns replacement text.

```ts
import { subslate } from 'subslate';
import type { Options, Sanitizer } from 'subslate';

const sanitizer: Sanitizer = ({ isEmpty, value }) => (isEmpty ? '' : String(value));

const options = {
	startStopPairs: ['|', ['<%', '%>']],
	allowUnquotedProps: true,
	allowRootBracket: true,
	sanitizer,
} as const satisfies Partial<Options>;

subslate('|user.name| <% [user].name %>', { user: { name: 'Ada' } }, options);
// 'Ada Ada'
```

A missing root or empty placeholder renders as `'undefined'` by default.
A partially resolved path renders its last resolved value. Subslate calls
the sanitizer once per placeholder ID per render. Supply a sanitizer
appropriate for the output context when interpolating untrusted values.

## Migrating from 1.x

Use a static ESM import or `import('subslate')` when migrating from the 1.x
CommonJS bundle. Node's own `require(esm)` support is also available to
CommonJS callers on Node versions that provide it.

The old polyfill builds have been retired. For modern browsers, use
`dist/subslate.esm.js` in place of `dist/subslate.poly.esm.js`, or use
`dist/subslate.js` in place of `dist/subslate.poly.js` and
`dist/subslate.poly.iife.js`. The old files remain available from the
[versioned 1.0.0 CDN directory](https://unpkg.com/browse/subslate@1.0.0/dist/).

Formal Deno runtime and `deno.land/x` support ends with 1.x. To stay on the
legacy URL, use the version-pinned named import.

```js
import { subslate } from 'https://deno.land/x/subslate@v1.0.0/mod.ts';
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
