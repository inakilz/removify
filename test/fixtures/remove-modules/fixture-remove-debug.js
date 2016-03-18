var debug = require('debug'),
    d = debug('a')

d(0)

function b() {
  d(1)
  console.log(2);
}

d(3)
