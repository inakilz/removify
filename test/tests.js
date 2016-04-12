var test               = require('tape'),
    fs                 = require('fs'),
    path               = require('path'),
    browserify         = require('browserify'),
    sourceMap          = require('source-map'),
    SourceMapConsumer  = sourceMap.SourceMapConsumer,
    convert            = require('convert-source-map')

fs.readdirSync('./test/fixtures').forEach(function(fixture) {

  test(fixture, function(t) {

    var dirpath = path.join('./test/fixtures/', fixture)

    fs.readdirSync(dirpath).filter(function(file) {
      return (/^fixture/).test(file)
    }).forEach(function(file) {
      var b = browserify({
        transform: [
          (/\.coffee$/).test(file) ? ['coffeeify'] : null,
          ['.', {m: 'debug'}]
        ].filter(function(t) { return t }),
        debug: true
      })

      b
        .add(path.join(dirpath, file))
        .on('error', function(e) {
          t.error(e, 'no error')
        })
        .bundle(function(err, src) {
          t.error(err, 'no error')
          src = src.toString('utf8')

          var expected = fs.readFileSync(path.join(dirpath, file.replace('fixture', 'expected')), 'utf8'),
              expectedMap = JSON.parse(fs.readFileSync(path.join(dirpath, file.replace('fixture', 'map')), 'utf8')),
              transformed = convert.removeComments(src).trim()
                .split('\n').slice(1, -2)   // remove prelude and eplilogue
                .join('\n')

          // verify
          t.equal(transformed, expected.trim(), 'equals expected')
          var map = convert.fromSource(src).toJSON()
          var con = new SourceMapConsumer(map)
          expectedMap.forEach(function(m) {
            var origPos = con.originalPositionFor({line: m[1][0], column: m[1][1]})
            t.equal(origPos.line, m[0][0])
            t.equal(origPos.column, m[0][1])
          })

          // console.log(fs.readFileSync(path.join(dirpath, file), 'utf8'));
          // console.log(src);
          // con.eachMapping(e => console.log(e))
        })
    })

    t.end()
  })

})
