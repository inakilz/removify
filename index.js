var util = require('util'),
    path = require('path'),
    stream = require('stream'),
    remove = require('remove-module')

module.exports = Removify
util.inherits(Removify, stream.Transform)

function Removify(file, opts) {

  var exts = ['.js', '.jsx', '.es', '.es6', '.coffee']
  if (exts.indexOf(path.extname(file)) === -1)
    return stream.PassThrough()

  if (!(this instanceof Removify))
    return new Removify(file, opts)

  stream.Transform.call(this)
  this._opts = opts
  this._data = ''
  this._filename = file

  return this
}

Removify.prototype._transform = function(buf, enc, callback) {
  this._data += buf
  callback()
}

Removify.prototype._flush = function(callback) {

  var opts = this._opts,
      modules = []
        .concat(opts.m)
        .concat(opts.module)
        .concat(opts.modules && opts.modules._)
        .filter(function(module) {
          return module
        })

  this.push(remove(modules, this._data, {
    filepath: this._filename,
    debug: this._opts._flags && this._opts._flags.debug
  }))
  callback()
}
