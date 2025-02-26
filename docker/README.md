# ocl-cache

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

This project will cache derived molecule properties like noStereoIDCode, logP, etc in a sqlite3 database.

## Development on Apple Silicon

If you npm configuration contains `ignore-scripts=true` you may have to execute the following commands:

```bash
cd node_modules/better-sqlite3
npm run build-release
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ocl-cache.svg
[npm-url]: https://www.npmjs.com/package/ocl-cache
[ci-image]: https://github.com/cheminfo/ocl-cache/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/ocl-cache/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/ocl-cache.svg
[codecov-url]: https://codecov.io/gh/cheminfo/ocl-cache
[download-image]: https://img.shields.io/npm/dm/ocl-cache.svg
[download-url]: https://www.npmjs.com/package/ocl-cache
