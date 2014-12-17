var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var done = this.async();
    this.prompt({
      type   : 'input',
      name   : 'title',
      message: 'The title in your project',
      default: 'My app'
    }, function (answers) {
      this.apptitle = answers.title;
      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      { title: this.apptitle }
    );
    [
      'src/style/main.less',
      'src/style/README.md',
      'src/app.jsx',
      '.gitignore',
      'gulpfile.js',
      'package.json'
    ].forEach(function (filename) {
      this.fs.copy(
        this.templatePath(filename),
        this.destinationPath(filename)
      );
    }.bind(this));
  },

  install: function () {
    this.installDependencies({npm: true, bower: false});
  }
});