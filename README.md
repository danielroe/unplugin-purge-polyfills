# unplugin-purge-polyfills

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> A tiny plugin to replace package imports with better native code.

This package is an [unplugin](https://unplugin.unjs.io/) which provides support for a wide range of bundlers.

At build time, it removes usage of these packages, in favour of directly using native replacements:

- is-number
- is-plain-object
- is-primitve
- is-regexp
- is-travis
- is-npm
- clone-regexp
- split-lines
- is-windows
- is-whitespace
- is-string
- is-odd
- is-even
- object.entries
- date
- array.of
- number.isnan
- array.prototype.findindex
- array.from
- object-is
- array-map
- is-nan
- function-bind
- regexp.prototype.flags
- array.prototype.find
- object-keys
- define-properties
- left-pad
- pad-left
- filter-array
- array-every
- index-of
- last-index-of
- abort-controller
- array-flatten
- array-includes
- has-own
- has-proto
- has-symbols
- object-assign

It is under active development.

## Roadmap

- [ ] investigate tighter integration with https://github.com/SukkaW/nolyfill or https://github.com/es-tooling/module-replacements
- [ ] implement publish-on-demand infrastructure to apply this plugin to published packages

## Usage

Install package:

```sh
# npm
npm install unplugin-purge-polyfills
```

```js
import { purgePolyfills } from 'unplugin-purge-polyfills'

// rollup.config.js
export default {
  plugins: [
    purgePolyfills.rollup({ /* options */ }),
  ],
}
```

## Configuration

By default this unplugin ships with a wide range of polyfills to get rid of, but you can disable these and add your own by providing a `replacements` object:

```js
// rollup.config.js
export default {
  plugins: [
    purgePolyfills.rollup({
      replacements: {
        'is-string': false, /** do not provide this polyfill */
        /**
         * provide a custom polyfill for this import in your codebase
         * make sure this is correct for every usage
         */
        'node.extend': {
          default: '(obj1, obj2) => { ...obj2, ...obj1 }'
        }
      }
    }),
  ],
}
```

The following polyfills are not purged, so you might want to add your own code to do so:

- node.extend
- extend-shallow
- xtend
- defaults

## Projects using or experimenting with `unplugin-purge-polyfill`

- [nuxt/cli](https://github.com/nuxt/cli/pull/439)
- [unjs/jiti](https://github.com/unjs/jiti/pull/261)

## Credits

Thanks to https://github.com/es-tooling/module-replacements and https://github.com/esm-dev/esm.sh for polyfill data. ❤️

Inspiration from https://github.com/SukkaW/nolyfill. ❤️

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with ❤️

Published under [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unplugin-purge-polyfills?style=flat-square
[npm-version-href]: https://npmjs.com/package/unplugin-purge-polyfills
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-purge-polyfills?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/unplugin-purge-polyfills
[github-actions-src]: https://img.shields.io/github/workflow/status/danielroe/unplugin-purge-polyfills/ci/main?style=flat-square
[github-actions-href]: https://github.com/danielroe/unplugin-purge-polyfills/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/danielroe/unplugin-purge-polyfills/main?style=flat-square
[codecov-href]: https://codecov.io/gh/danielroe/unplugin-purge-polyfills
