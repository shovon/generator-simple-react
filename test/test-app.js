var helpers = require('yeoman-generator').test;
var path = require('path');

describe('simple-react:app', function () {
  describe('no options', function () {
    var react;
    var appName = 'simpleApp';

    beforeEach(function (done) {
      var deps = [
        '../../../app'
      ];
      helpers
        .testDirectory(path.join(__dirname, '.tmp', appName), function (err) {
          if (err) { return done(err); }
          react = helpers.createGenerator('simple-react:app', deps, [appName], {
            'appPath': 'app',
            'skip-welcome-message': true,
            'skip-install': true,
            'skip-message': true
          });
          done();
        });
    });

    it('should generate an entirely new application', function () {
      react.run({}, function () {
        helpers.assertFile([
          '.gitignore',
          'gulpfile.js',
          'package.json',
          'src/index.html',
          'src/app.jsx',
          'src/style/main.less',
          'src/style/README.md'
        ]);
      });
    });
  });
});