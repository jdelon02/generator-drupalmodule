'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var DrupalmoduleGenerator = module.exports = yeoman.generators.Base.extend({
	//yeoman.generators.Base.apply(this, arguments);
	install: function () {
	  this.spawnCommand('composer', ['install']);
	}
	this.moduleName = path.basename(process.cwd());
    this.on('end', function () {
	  this.installDependencies({ skipInstall: options['skip-install'] });
	});
});


var DrupalmoduleGenerator = module.exports = function DrupalmoduleGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  generators.Base.extend({
	install: function () {
	  this.spawnCommand('composer', ['install']);
	}
  });
  this.moduleName = path.basename(process.cwd());

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });
};

//util.inherits(DrupalmoduleGenerator, yeoman.generators.Base);

DrupalmoduleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'moduleDesc',
    message: 'Describe your module:'
  },{
    name: 'modulePackage',
    message: 'Provide a module package:',
    default: 'Custom'
  },{
    name: 'moduleDepend',
    message: 'What are your module\'s Drupal dependenies? (space seperated)'
  },{
    name: 'addCss',
    message: 'Add stylesheet?',
    default: 'Y/n'
  },{
    name: 'addJs',
    message: 'Add javascript file?',
    default: 'Y/n'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.moduleDesc = props.moduleDesc;
    this.modulePackage = props.modulePackage;
    this.dependencies = props.moduleDepend.length !== 0 ? 'dependencies[] = ' + props.moduleDepend.split(' ').join('\r\ndependencies[] = ') : '';
    this.stylesheets = (/y/i).test(props.addCss) ? 'stylesheets[all][] = css/' + this.moduleName + '.css' : '';
    this.javascripts = (/y/i).test(props.addJs)? 'scripts[] = js/' + this.moduleName + '.js' : '';

    cb();
  }.bind(this));
};

DrupalmoduleGenerator.prototype.app = function app() {
  var mn = this.moduleName;
  this.mkdir('css');
  this.mkdir('js');
  this.mkdir('templates');
  this.mkdir('views');
  this.mkdir('includes');

  this.template('_package.json', 'package.json');
  // this.copy('_bower.json', 'bower.json');
  this.template('_gulpfile.js', 'gulpfile.js');
  this.template('_phpdoc.xml', 'phpdoc.xml');
  this.template('_composer.json', 'composer.json');
  this.template('_firebase.json', 'firebase.json');
  this.template('_bitbucket-docs.json', 'bitbucket-docs.json');

  this.template('_template.info', mn + '.info');
  this.template('_template.module', mn + '.module');

  if (this.stylesheets) {
    this.copy('template.css', 'css/' + mn + '.css');
  }
  if (this.javascripts) {
    this.copy('template.js', 'js/' + mn + '.js');
  }
};
