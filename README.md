# removify

[![travis-ci](https://img.shields.io/travis/keik/removify.svg?style=flat-square)](https://travis-ci.org/keik/removify)
[![npm-version](https://img.shields.io/npm/v/removify.svg?style=flat-square)](https://npmjs.org/package/removify)

Browserify trasform to remove codes to which related specific module using AST.


# Install

```
npm install removify
```


# Usage

## CLI

```
browserify -t [ removify -m <module-name> ] main.js -o bundle.js
```

## Example

Now `main.js` given like:

```js
var debug = require('debug'),
    d = debug('a')

d(0)

function b() {
  d(1)
  console.log(2);
}

d(3)
```

then use the `browserify` command to build `main.js` with `-t [ removify -m debug ]` to remove code to which related `debug` module:

```
browserify -t [ removify -m debug ] main.js -o bundle.js
```

and `bundle.js` will be outputed like:

```js
function b() {
    console.log(2);
}
```


# Test

```
% npm install
% npm test
```


# License

MIT (c) keik
