debug = require 'debug'
d = debug('a')

d 0

b = () ->
  d 1
  console.log 2

d(3)
