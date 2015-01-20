var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('apptitle', {type: String, required: true});
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      {
        title: this.apptitle
      }
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    [
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