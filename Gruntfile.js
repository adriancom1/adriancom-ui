require('shelljs/global');
var fs = require('fs');
var color = require('bash-color');

//Dependencies:
hasBin('git', 'http://git-scm.com/downloads');
hasBin('divshot', 'npm install -g divshot');
hasBin('aws', 'pip install awscli');

exec('clear');

module.exports = function(grunt) {

	grunt.initConfig({
		// Multi Tasks Configuration
		pkg: grunt.file.readJSON('package.json'),		
	   	dir : {root:'public', src: 'public/js', dest: 'build/js', vendor:'js/vendor/', tmp: 'tmp/js/vendor'},
	   	pwd: function() {
	   		return pwd();
	   	},
	   	endPoint : 'http://adriancom.s3-website-us-west-2.amazonaws.com',
	   	push: {
	   		git: function() {
		    	//run('git commit', 'Changes have not been added to commit.', 'Changes were added.', 'git push adrian master');
		    },
	    	aws:  function() {
				//Change to the Assets folder
				// cd('public/assets');
				
				// //Run the Sync Command. This should copy files and directories over to AWS
				// run('aws s3 sync . s3://adriancom --exclude ".DS_*"', 'AWS S3 Synch failed',
				// 	'Assets were pushed to AWS', 'aws s3 ls s3://adriancom --summarize');
				
				// //Reset cwd location
				// cd('../../');
	    	},
	    	js: {
	    		buildLoc : '<%=dir.dest%>',
	    		name : '<%=pkg.name%>',
	    		root: '<%=dir.root%>',
	    		src: '<%=dir.src%>',
	    		tmp: '<%=dir.tmp%>',
	    		pkg : '<%=pkg.name%>'

	    	},
	    	projects : {
	    		endPoint : '<%=endPoint%>',
	    		staticFiles: ['adrian.html'],
	    		pkg : '<%=pkg.name%>',
	    		dir : '<%=dir%>'
	    	},
	    	main : {
	    		endPoint : '<%=endPoint%>',
	    		staticFiles: ['index.html'],
	    		pkg : '<%=pkg.name%>',
	    		dir : '<%=dir%>'
	    	},
		    static: function(environment) {
		    	var environment = environment || 'development';
		    	//run('divshot push ' + environment, 'Sync failed.', 'Static files were pushed to ' + environment);
		    }
	  	},
		concat: {
			options: {
				separator: ';',
      			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n */',
			},
			main: {
				src: ['<%=dir.src%>/dom-utils.js', '<%=dir.src%>/scroll-utils.js','<%=dir.src%>/gridanim.js',
					  '<%=dir.src%>/scenes.js', '<%=dir.src%>/app.js','!<%=dir.src%>/ng*.js'],
				dest: '<%=dir.dest%>/main-<%= pkg.name %>.js'
			},
			angular: {
				src: ['<%=dir.src%>/ng*.js'],
				dest: '<%=dir.dest%>/ng-<%= pkg.name %>.js'
			},
			projects: {
				src: ['<%=dir.src%>/dom-utils.js', '<%=dir.src%>/scroll-utils.js','<%=dir.src%>/projects.js'],
				dest: '<%=dir.dest%>/projects-<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
				mangle: false
			},
			main: {
				files: {
					//Destination, Source
					'<%=dir.dest%>/main-<%= pkg.name %>.min.js': ['<%=dir.dest%>/main-<%= pkg.name %>.js'],
					'<%=dir.dest%>/ng-<%= pkg.name %>.min.js': ['<%=dir.dest%>/ng-<%= pkg.name %>.js']
				}				
		    },
			projects: {
				files: {
					//Destination, Source
					'<%=dir.dest%>/projects-<%= pkg.name %>.min.js': ['<%=dir.dest%>/projects-<%= pkg.name %>.js']
				}				
		    }
		},
		wiredep: {
			main: {
				src: ['<%=dir.root%>/adrian.html']
			}
		}	    
	});

	// Define Multi Tasks
	grunt.registerMultiTask('push', 'Push source files to specified environments. ', function(optionalFlag) {
		var target = this.target;

		//Helper function to parse the <script> blocks with the CDN Url naming info
		function parsePath(value) {
			//If Script not found then return
			if(~value.indexOf('<script') == 0) return;
			var parts = [];
			parts.push(value.split('.com/')[0]);
			//Extract the sub directories following the .com 
			var reg = /.com(?=\/[a-zA-Z]).[a-z].*/;
			var path = value.match(reg)[0];
			parts.push(path.substr(0,5));
			path = path.substr(5);
			path = path.replace(/[a-zA-Z-]*/,'js/vendor');
			path = path.replace('.js', '.min.js');
			
			//Enable this in the future, Angular Gzip tends to fail in IE
			//if(~path.indexOf('-') == 0) {
				//path = path.replace('.js', '.js.gzip');
			//}
			parts.push(path);
			return parts.join('');
		};

		function scriptTag(value) {
			return '<script src="' + value + '"></script>\n'
		};

		switch(target) {
			case 'static':
				var args = arguments[0];
				banner.call(this, grunt, args);
				this.data(args);
			break;
			case 'js':
				console.log('START  ',pwd())
				var data = this.data;
				var buildLoc = '../../../' + data.buildLoc + '/vendor';
				//Change values to create a local tmp directory
				if (optionalFlag === 'local') {
					//Temp Local Directory
					buildLoc = '../../'+data.tmp;
				}

				//Copy Vendor JS Scripts to the Build directory
				banner.call(this, grunt);
				cd(data.src+'/vendor');
	    		ls().forEach(function(path) {
					//Copy files to Build for Sync to CDN
					cp('-Rrf', path + '/ang*.js', buildLoc); //Angular only
					cp('-Rrf', path + '/*.min.js', buildLoc);
					cp('-Rrf', path + '/*.map', buildLoc); //HTML5 Map files for use with .min
					cp('-Rrf', path + '/*.js.gzip', buildLoc);
				});
				
				//Only push to AWS if flag is not set to 'local'
	     		if(optionalFlag !== 'local') {
	     			cd('../../../build');
		    		//If the folder is invalid
		    		if(ls()[0] !== 'js') exit(1);
		     		//Sync all of the Vender specific JS Minified files
					run('aws s3 sync . s3://adriancom --exclude "*" --include "*.map" --include "*.js" --exclude "*.js.gzip" ', 'AWS S3 Synch failed',
						'Assets were pushed to AWS', 'aws s3 ls s3://adriancom --summarize');
					//Sync all of the Vender specific GZIP files
					run('aws s3 sync . s3://adriancom --exclude "*" --include "*.js.gzip" --content-encoding "gzip" ', 'AWS S3 GZIP Synch failed',
						'GZIP Assets were pushed to AWS\n');
					cd('..');
				} else {
					cd('../../../build/js');
					cp('-rf', '*-' + data.pkg + '.min.js', '../../public/tmp/js');
					banner.call(this, grunt, 'Pushing JS scripts to Local Dev.');
					cd('../../');// Back to root
				}

				//Insert reference to HTML file
				grunt.task.run('wiredep'); //This handles the 'Projects' main template
				console.log('END  ',pwd())

			break;
			case 'projects':
				// Wiredep will inject Bower dependencies
				 banner.call(this, grunt);
				var data = this.data;
				var jsDir = '/js/';
				var sourceFile = pwd() + '/' + data.dir.root + '/' + data.staticFiles[0];
				var beginBower = '<!-- bower:js -->';
				var endBower = '<!-- endbower -->';
				var endPoint = (optionalFlag !== 'local') ? data.endPoint : data.dir.tmp;
				//Sed Return Value
				var sedRet = sed('-i', /js\/vendor/g, endPoint, sourceFile).split(beginBower);
				//Split the file into blocks and extract the Bower Wiredep and Script Dependencies
				sedRet.splice(1, 0, beginBower);
				//Split the end block from the end of the Bower tag to the end of string
				var _endBower = sedRet[2].split(endBower);
				sedRet.splice(2, 1, _endBower[0]);
				sedRet.push(endBower);
				sedRet.push(_endBower[1]);

				//Re-format the Script blocks to match the naming structure of AWS Cdn
				var scriptBlock = sedRet[2].split('</script>');
				scriptBlock = scriptBlock.map(function(item) {
					var endScript = "</script>\n";
					if(optionalFlag !== 'local') {
						return parsePath(item) + endScript;	
					}
					jsDir = "/";
					//Remove Angular sub-folders when building locally
					return item.replace(/angula..*\//, '') + endScript;
				});
				if (optionalFlag === 'local') {
					endPoint = endPoint.replace('/vendor', '');
				}
				//Remove the last item
				scriptBlock.length = scriptBlock.length-1;
				//Insert the script block within the bower:js tags
				scriptBlock.push(scriptTag(endPoint + jsDir + this.target +'-'+ data.pkg + '.min.js'));
				//Insert the Angular app Js scripts
				scriptBlock.push(scriptTag(endPoint + jsDir + 'ng-'+ data.pkg + '.min.js'));
				//Append the newly formatted Script tags
				sedRet[2] = scriptBlock.join(''); 
				//Write File Synchronously
				fs.writeFileSync(sourceFile, sedRet.join(''));

			break;
			case 'main':
				//Custom adrian:js will inject Angular dependencies
				banner.call(this, grunt);
				var data = this.data;

				//Dynamically inject a generated <script> tag into the specified target file
				var beginTag = '<!-- adrian:js -->';
				var endTag = '<!-- endadrian -->';
				var sourceFile = pwd() + '/' + data.dir.root + '/' + data.staticFiles[0];
				var genScript = scriptTag(data.endPoint + '/js/' + this.target +'-'+ data.pkg + '.min.js');
				var gRet = grep('-v', beginTag, sourceFile).split(endTag);
				
				//Check for the existance of a <script> tag outside of the 'inject' delimiters
				var tmp = gRet[0];
				//Check for injected script location
				var scLoc = tmp.length - genScript.length;
				if(~(tmp.substr(scLoc)).indexOf('<script') != 0 ) {
					gRet[0] = gRet[0].substr(0, scLoc);
				}
				gRet.splice(1, 0, beginTag + '\n');
				gRet.splice(2, 0, genScript);
				gRet.splice(3, 0, endTag);
				
				//Write File Synchronously
				fs.writeFileSync(sourceFile, gRet.join(''));

			break;

			default:
				banner.call(this, grunt);
				this.data();
		}
	});	

	//Load Grunt Plugins
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-wiredep');

	grunt.registerTask('build', '[BUILD]', function() {
		grunt.task.run('concat', 'uglify', 'push');
	});

	grunt.registerTask('build-dev', '[BUILD: Local]', function() {
		grunt.task.run('concat', 'uglify', 'push:js:local', 'push:projects:local', 'push:main');
	});

// END
};




// Additional Script Utils
function run(command, errorMessage, successMessage, onCompleteCommand) {
	var command = exec(command);
	if (command.code !== 0) {
		// Only IF Git:
		if(~command.output.indexOf('nothing to commit') != 0) { //if True
			ok.call(echo, successMessage);
			exec(onCompleteCommand);
			return;
		}		
		echo(color.red('==========================================================', true));
		echo('[ERROR] :: ' + errorMessage);
		echo(color.red('==========================================================', true));
		exit(1);
	} else {
		ok.call(echo, successMessage);
		if(onCompleteCommand) {
			exec(onCompleteCommand);
		}
	}
};

//Displays a banner that describes the current task
function banner(grunt, arg) {
	grunt.log.writeln(color.white('\n==========================================================', true) );
	grunt.log.writeln(color.purple('\nExecuting Task [ ')+ color.yellow(this.name) + color.purple(' : ') + color.yellow(this.target, true) + color.purple(' ] ==> ') + (arg || '') );
	grunt.log.writeln(color.white('\n==========================================================', true) );
};

//Success Message
function ok(msg) {
	this(color.green('==========================================================', true));
	this(color.yellow('---> \n[SUCCESSFUL] :: ' + msg, true));
	this(color.green('==========================================================', true));
};

//Check for installed binary dependencies
function hasBin(name, packageName) {
	if (!which(name)) {
		echo(color.red('=========================================================='), true );
		echo(color.red('[ERROR] :: ', true) + color.red('The '+ String.prototype.toUpperCase.call(name.substr(0,1)) + name.substr(1) +' module was not found.') + ' Run: ' + packageName);
		echo(color.red('==========================================================') );
		exit(1);
	}
};
