'use strict';

var shell = require('shelljs');
var Dgeni = require('dgeni');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    clean: ['.tmp', 'build'],

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
        dest: '.tmp/js/<%= pkg.name %>.js'
      },
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: 'build/js/<%= pkg.name %>.js',
        dest: 'build/js/<%= pkg.name %>.min.js'
      },
      dist: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
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
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json', 'dist'],
        push: true
      }
    },

    'npm-publish': {
      options: {
        // list of tasks that are required before publishing
        requires: ['build'],
        // if the workspace is dirty, abort publishing (to avoid publishing local changes)
        abortIfDirty: true
      }
    },

    'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors'
      }
    },

    'gh-pages': {
      options: {
        base: 'build'
      },
      src: ['**']
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
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jscs', 'test', 'build']);

  grunt.registerTask('test', ['jshint', 'jscs', 'mochaTest']);
  // grunt.registerTask('build', ['concat', 'uglify', 'docs']);
  grunt.registerTask('build', ['concat', 'browserify', 'uglify']);

  grunt.registerTask('dev', ['clean', 'copy', 'build', 'copy', 'docs', 'connect', 'watch']);

  grunt.registerTask('docs', 'Generate docs via dgeni.', function() {
    var done = this.async();
    var dgeni = new Dgeni([require('./docs/config')]);
    
    dgeni.generate().then(done);
  });

  grunt.registerTask('browserify', function () {
    grunt.task.requires('concat');
    shell.mkdir('-p', 'build/js');
    shell.mkdir('-p', 'dist/js');

    shell.exec('browserify .tmp/js/smeans.js -s Smeans', { silent: true }).output.to('build/js/smeans.js');

    shell.cp('build/js/smeans.js', 'dist/js/smeans.js');
  });

  grunt.registerTask('release', function (type) {
    grunt.task.run([
      'clean',
      'copy',
      'build',
      'docs',
      'npm-contributors',
      'bump:' + (type || 'patch'),
      'npm-publish',
      'gh-pages'
    ]);
  });
};
