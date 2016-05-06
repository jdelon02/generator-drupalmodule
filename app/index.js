'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;

var DrupalmoduleGenerator = function DrupalmoduleGenerator(args, options, config) {
  yeoman.Base.apply(this, arguments);
  
  this.on('end', function () {
	var moduledir = process.cwd() + '/' + this.moduleName;
    process.chdir(moduledir);
    this.installDependencies({ skipInstall: options['skip-install'] });
    exec('composer install', function(error, stdout, stderr) {
      if (error) {
        console.log(stderr);
      } else {
        console.log(stdout);
        console.log("Composer Install Complete!");
      }
    });
    exec('git init; git add .; git commit -m \"Initial Commit\"', function(error, stdout, stderr) {
      if (error) {
        console.log(stderr);
      } else {
        console.log(stdout);
        console.log("Git Initialized!");
      }
    });
    exec('gulp; phpdoc', function(error, stdout, stderr) {
      if (error) {
        console.log(stderr);
      } else {
        console.log(stdout);
        console.log("PHPDocs Generated!");
      }
    });
    exec('firebase deploy -m \"initial upload\"', function(error, stdout, stderr) {
      if (error) {
        console.log(stderr);
      } else {
        console.log(stdout);
        console.log("Firebase Initial Deploy!");
      }
    });
  });
};

util.inherits(DrupalmoduleGenerator, yeoman.Base);

DrupalmoduleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
	name: 'moduleName',
	message: 'Your Module Name (no spaces)'
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
  this.mkdir(mn + '/templates');
  this.mkdir(mn + '/views');
  this.mkdir(mn + '/includes');
  this.mkdir(mn + '/docs');
  
  exec('cd ' + mn + '; firebase -f ' + mn + ' -p docs ; cd ..', function(error, stdout, stderr) {
    if (error) {
	  console.log(stderr);
	} else {
	  console.log(stdout);
	  console.log("Firebase Initial setup!");
	}
  });
  
  this.template('_package.json', mn + '/package.json');
  this.template('_bower.json', mn + '/bower.json');
  this.template('_gulpfile.js', mn + '/gulpfile.js');
  this.template('_phpdoc.xml', mn + '/phpdoc.xml');
  this.template('_composer.json', mn + '/composer.json');
  this.template('_firebase.json', mn + '/firebase.json');
  this.template('_bitbucket-docs.json', mn + '/bitbucket-docs.json');

  this.template('_template.info', mn + '/' + mn + '.info');
  this.template('_template.module',  mn + '/' + mn + '.module');

  this.copy('gitignore', mn + '/.gitignore');
  
  if (this.stylesheets) {
	this.mkdir(mn + '/css');
    this.copy('template.css',  mn + '/css/' + mn + '.css');
  }
  if (this.javascripts) {
	this.mkdir(mn + '/js');
    this.copy('template.js',  mn + '/js/' + mn + '.js');
  }
};

module.exports = DrupalmoduleGenerator;

