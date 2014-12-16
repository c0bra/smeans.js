'use strict';

var Dgeni = require('dgeni');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist', 'build'],

    copy: {
      bower: {
        files: [{
          expand: true,
          cwd: 'bower_components',
          src: ['**/*.js', '**/*.css', '**/*.js.map'],
          dest: 'build/components'
        }]
      },
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
        src: ['src/<%= pkg.name %>.js'],
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
      source: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.spec.js']
      }
    },

    jscs: {
      src: ['src/**/*.js', 'test/**/*.spec.js'],
      options: {
        config: '.jscs.json'
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      source: {
        files: '<%= jshint.source.src %>',
        tasks: ['jshint:source', 'jscs', 'test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'jscs', 'test']
      },
      docs: {
        files: ['<%= jshint.source.src %>', 'docs/**/*.js', 'docs/content/**', 'docs/config/templates/**/*.template.html'],
        tasks: ['docs']
      },
      copyDocs: {
        files: ['docs/assets/**'],
        tasks: ['copy:docs']
      },
      livereload: {
        options: { livereload: true },
        files: ['build/**/*'],
      }
    },

    connect: {
      docs: {
        options: {
          base: 'build',
          port: 8123,
          livereload: true
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

  grunt.registerTask('dev', ['clean', 'copy', 'build', 'connect', 'watch']);

  grunt.registerTask('docs', 'Generate docs via dgeni.', function() {
    var done = this.async();
    var dgeni = new Dgeni([require('./docs/config')]);
    
    dgeni.generate().then(done);
  });
};
