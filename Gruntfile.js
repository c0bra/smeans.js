'use strict';

var Dgeni = require('dgeni');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist', 'build'],

    copy: {
      docs: {
        files: [{
            expand: true,
            cwd: 'docs/assets/',
            src: '**',
            dest: 'build'
        }]
      }
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      build: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      },
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: '<%= concat.build.dest %>',
        dest: 'build/js/<%= pkg.name %>.min.js'
      }
    },

    mochaTest: {
      test: {
        src: 'test/**/*.spec.js',
        options: {
          reporter: 'dot'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: ['lib/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.spec.js']
      }
    },

    jscs: {
      src: ['lib/**/*.js', 'test/**/*.spec.js'],
      options: {
        config: '.jscs.json'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'jscs', 'test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'jscs', 'test']
      },
      docs: {
        files: ['<%= jshint.lib.src %>', 'docs/content/**'],
        tasks: ['docs']
      }
    },

    connect: {
      docs: {
        options: {
          base: 'build',
          port: 8123
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jscs', 'test', 'concat', 'uglify']);

  grunt.registerTask('test', ['jshint', 'jscs', 'mochaTest']);
  grunt.registerTask('build', ['concat', 'uglify', 'docs']);

  grunt.registerTask('dev', ['clean', 'build', 'connect', 'watch']);

  grunt.registerTask('docs', 'Generate docs via dgeni.', function() {
    var done = this.async();
    var dgeni = new Dgeni([require('./docs/config')]);
    
    dgeni.generate().then(done);
  });
};
