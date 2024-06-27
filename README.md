# unplugin-purge-polyfills

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> A tiny plugin to replace package imports with better native code.

This package is an [unplugin](https://unplugin.unjs.io/) which provides support for a wide range of bundlers.

It is under active development.

## Roadmap

- [ ] use database of polyfills from https://github.com/SukkaW/nolyfill or https://github.com/es-tooling/module-replacements
- [ ] implement publish-on-demand infrastructure to apply this plugin to published packages

## Usage

Install package:

```sh
# npm
npm install unplugin-purge-polyfills
```

```js
import { purgePolyfills } from 'unplugin-purge-polyfills'
```

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
