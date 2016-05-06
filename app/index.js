'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var fs = require('fs');
var exec = require('child_process').exec;
//In your generator
//mkdirp.sync('/some/path/to/dir/');
function makeModuleName(moduleName) {
	moduleName = _.kebabCase(moduleName);
  //name = name.indexOf('generator-') === 0 ? name : 'generator-' + name;
  return moduleName;
}


var DrupalmoduleGenerator = module.exports = function DrupalmoduleGenerator(args, options, config) {
  yeoman.Base.apply(this, arguments);
  
  //this.moduleName = path.basename(process.cwd());

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
    
    exec('composer install', function(error, stdout, stderr) {
    	  if (error) {
    	    console.log(stderr);
    	  } else {
    	    console.log(stdout);
    	    console.log("Install Complete!");
    	  }
    	});
  });

  //this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DrupalmoduleGenerator, yeoman.Base);

DrupalmoduleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
	name: 'moduleName',
	message: 'Your Module Name',
	default: makeModuleName(path.basename(process.cwd())),
	filter: makeModuleName,
	validate: function (str) {
	  return str.length > 0;
	}
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
  this.template('_template.module',  mn + '/' + mn + '.module');

  if (this.stylesheets) {
    this.copy('template.css',  mn + '/css/' + mn + '.css');
  }
  if (this.javascripts) {
    this.copy('template.js',  mn + '/js/' + mn + '.js');
  }
};
