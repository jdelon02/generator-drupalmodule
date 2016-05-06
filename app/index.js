'use strict';
var util = require('util');
var path = require('path');
var askName = require('inquirer-npm-name');
var yeoman = require('yeoman-generator');

function makeModuleName(name) {
	  name = _.kebabCase(name);
	  //name = name.indexOf('generator-') === 0 ? name : 'generator-' + name;
	  return name;
	}

var DrupalmoduleGenerator = module.exports = yeoman.Base.extend({
	yeoman.Base.apply(this, arguments);
	install: function () {
	  this.spawnCommand('composer', ['install']);
	}
    
	this.on('end', function () {
	  this.installDependencies({ skipInstall: options['skip-install'] });
	});
});


DrupalmoduleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'name',
	message: 'Your Module Name',
	default: makeModuleName(path.basename(process.cwd())),
	filter: makeModuleName,
	validate: function (str) {
	  return str.length > 0;
	}
  },{
	name: 'moduleName',
	message: 'Your Module Name:'
  },{
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

    this.moduleName = props.moduleName;
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
  this.mkdir(mn);
  this.mkdir(mn + '/css');
  this.mkdir(mn + '/js');
  this.mkdir(mn + '/templates');
  this.mkdir(mn + '/views');
  this.mkdir(mn + '/includes');

  this.template('_package.json', mn + '/package.json');
  this.template('_gulpfile.js', mn + '/gulpfile.js');
  this.template('_phpdoc.xml', mn + '/phpdoc.xml');
  this.template('_composer.json', mn + '/composer.json');
  this.template('_firebase.json', mn + '/firebase.json');
  this.template('_bitbucket-docs.json', mn + '/bitbucket-docs.json');

  this.template('_template.info', mn + '/' + mn + '.info');
  this.template('_template.module', mn + '/' + mn + '.module');

  if (this.stylesheets) {
    this.copy('template.css', mn + '/css/' + mn + '.css');
  }
  if (this.javascripts) {
    this.copy('template.js', mn + '/js/' + mn + '.js');
  }
};
