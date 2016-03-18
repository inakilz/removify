var test = require('tape'),
    fs   = require('fs'),
    path = require('path'),
    browserify = require('browserify')

fs.readdirSync('./test/fixtures').forEach(function(fixture) {

  test(fixture, function(t) {

    var dirpath = path.join('./test/fixtures/', fixture)

    fs.readdirSync(dirpath).filter(function(file) {
      return /^fixture/.test(file)
    }).forEach(function(file) {

      var b = browserify({
        transform: [
          ['.', {m: 'debug'}]
        ]
      })
      b.add(path.join(dirpath, file))
      b.bundle(function (err, src) {
        t.error(err, 'no error')
        src = src.toString('utf8')

        var expected = fs.readFileSync(path.join(dirpath, file.replace('fixture', 'expected')), 'utf8'),
            transformed = src.split('\n')

        // remove prelude
        transformed = transformed.slice(1, -2).join('\n')

        t.equal(transformed, expected, 'equals expected')
      })
    })

    t.end()
  })

})
