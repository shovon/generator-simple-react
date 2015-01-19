var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },
  writing: function () {
    [
      '.gitignore',
      'gulpfile.js',
      'package.json',
      'src/app.jsx',
      'src/index.html',
      'src/style/main.less',
      'src/style/README.md'
    ].forEach(function (filename) {
      this.fs.copy(
        this.templatePath(filename),
        this.destinationPath(filename)
      );
    }.bind(this));
  }
});