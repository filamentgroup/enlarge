/*global module:true*/
(function(){
	'use strict';

	module.exports = function(grunt) {

		// Project configuration.
		grunt.initConfig({
			// Metadata.
			pkg: grunt.file.readJSON('package.json'),
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
			// Task configuration.
			clean: {
				files: ['dist']
			},
			concat: {
				options: {
					banner: '<%= banner %>',
					stripBanners: true
				},
				/*lib: {
					src: 'node_modules/jquery/dist/jquery.js',
					dest: 'libs/jquery/jquery.js'
				},*/
				dist: {
					src: ['src/enlarge.js', 'src/enlarge-init.js'],
					dest: 'dist/enlarge.js'
				}
			},
			uglify: {
				options: {
					banner: '<%= banner %>'
				},
				dist: {
					src: ['<%= concat.dist.src %>'],
					dest: 'dist/enlarge.min.js'
				}
			},
			qunit: {
				files: ['test/**/*.html']
			},
			jshint: {
				gruntfile: {
					options: {
						jshintrc: '.jshintrc'
					},
					src: 'Gruntfile.js'
				},
				src: {
					options: {
						jshintrc: '.jshintrc'
					},
					src: ['src/**/*.js']
				},
				test: {
					options: {
						jshintrc: '.jshintrc'
					},
					src: ['test/**/*.js']
				}
			},
			watch: {
				gruntfile: {
					files: '<%= jshint.gruntfile.src %>',
					tasks: ['jshint:gruntfile']
				},
				src: {
					files: '<%= jshint.src.src %>',
					tasks: ['jshint:src', 'qunit']
				},
				test: {
					files: '<%= jshint.test.src %>',
					tasks: ['jshint:test', 'qunit']
				}
			}
		});

		// These plugins provide necessary tasks.
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-qunit');
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-watch');

		// Default task.
		grunt.registerTask('default', [ 'clean', 'concat', 'uglify']);

	};
})();
