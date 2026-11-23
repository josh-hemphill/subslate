# 2.0.0-beta.0

The first Subslate 2.0 beta ships an ESM package for Node.js and modern browsers
with zero runtime dependencies. Install the prerelease with
`npm install subslate@2.0.0-beta.0` once it is available on npm.

## Upgrade from 1.x

- **Node.js and CommonJS.** Subslate 2.0 requires Node.js 22.13.0 or newer and
  ships ESM. Import `subslate` as a named or default export. CommonJS callers can
  use `import('subslate')` or Node’s native `require(esm)`.
- **Browser bundles.** Import `dist/subslate.esm.js` as a browser module or load
  `dist/subslate.js` as a classic script. The classic script exposes
  `globalThis.subslate.subslate`. If you rely on the retired polyfill bundles,
  switch to one of those builds or pin the
  [1.0.0 browser assets](https://unpkg.com/browse/subslate@1.0.0/dist/).
- **Deno.** Formal Deno runtime and `deno.land/x` support ends with 1.x. To stay
  on the legacy distribution, use the named export from
  [the version-pinned 1.0.0 module](https://deno.land/x/subslate@v1.0.0/mod.ts).

## Fixes and improvements

- **Correct replacement order.** Emoji no longer shift replacement positions.
  Interleaved repeat placeholders now render in source order. For example,
  `'😀 ${x} ${y} ${x}'` with `x = 'expanded'` and `y = 'B'` renders as
  `'😀 expanded B expanded'`. The sanitizer still runs once per placeholder ID
  per render, in first-seen order.
- **Public TypeScript types.** Import `Options`, `Sanitizer`, `SanitizerOptions`,
  and delimiter types from the package. The declarations now accept single
  string delimiters and mixed lists of strings and pairs, including readonly
  literals.
- **Distribution and CI.** The beta uses the npm `beta` dist-tag. A separate
  workflow job is prepared to publish the source package to JSR as
  `@josh-hemphill/subslate`. CI tests the packed npm artifact with Node 22, 24,
  and 26, TypeScript, Chromium, and a production Vite build.

[Migration guide](https://github.com/josh-hemphill/subslate/blob/latest/README.md#migrating-from-1x)
· [Implementation PR #21](https://github.com/josh-hemphill/subslate/pull/21)

# 1.0.0 (2021-03-03)


### Bug Fixes

* :bug: Fix overlapping names ([9621f00](https://github.com/josh-hemphill/subslate/commit/9621f004c6695ad32fbb6848eed4ad1bc8cebb3e))
* eslint errors & regExp escapes ([d672077](https://github.com/josh-hemphill/subslate/commit/d672077a73da49b9d64ee67bffed2db2fe6cd25e))
* eslintrc ([b4b5a52](https://github.com/josh-hemphill/subslate/commit/b4b5a52cd146957d763c5ddfa3133cf80ffc8459))
* husky ([b217214](https://github.com/josh-hemphill/subslate/commit/b217214997eac8aed8fbb0853ce7214b8d95b0f6))
* ts-ignore use of object ([39641fc](https://github.com/josh-hemphill/subslate/commit/39641fcac903cd162b2c754f1b0dab3392990b65))


### Features

* First working draft ([7ab76ef](https://github.com/josh-hemphill/subslate/commit/7ab76efaa2a2dfd895236af3100807ee0e94a0c7))
* Improved String Parsing ([d708005](https://github.com/josh-hemphill/subslate/commit/d7080051d968c4f0da9457732ba26079a01a98bb))
* Mixed bracket def ([29f90f4](https://github.com/josh-hemphill/subslate/commit/29f90f4759bf6a3d8b2a22d8b7e5c882ae0fe7e6))

# 1.0.0-alpha.0 (2021-03-03)


### Bug Fixes

* :bug: Fix overlapping names ([9621f00](https://github.com/josh-hemphill/subslate/commit/9621f004c6695ad32fbb6848eed4ad1bc8cebb3e))
* eslint errors & regExp escapes ([d672077](https://github.com/josh-hemphill/subslate/commit/d672077a73da49b9d64ee67bffed2db2fe6cd25e))
* eslintrc ([b4b5a52](https://github.com/josh-hemphill/subslate/commit/b4b5a52cd146957d763c5ddfa3133cf80ffc8459))
* husky ([b217214](https://github.com/josh-hemphill/subslate/commit/b217214997eac8aed8fbb0853ce7214b8d95b0f6))
* ts-ignore use of object ([39641fc](https://github.com/josh-hemphill/subslate/commit/39641fcac903cd162b2c754f1b0dab3392990b65))


### Features

* First working draft ([7ab76ef](https://github.com/josh-hemphill/subslate/commit/7ab76efaa2a2dfd895236af3100807ee0e94a0c7))
* Improved String Parsing ([d708005](https://github.com/josh-hemphill/subslate/commit/d7080051d968c4f0da9457732ba26079a01a98bb))
* Mixed bracket def ([29f90f4](https://github.com/josh-hemphill/subslate/commit/29f90f4759bf6a3d8b2a22d8b7e5c882ae0fe7e6))
