"use strict";

module.exports = function defaultDeployment() {
  return {
    name: 'default',
    examples: {
      commonFiles: {
        scripts: [ '../../../smeans.js' ]
      },
      dependencyPath: '../../../'
    },
    scripts: [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'bower_components/google-code-prettify/src/prettify.js',
      'bower_components/google-code-prettify/src/lang-css.js',
      'js/docs.js'
    ],
    stylesheets: [
      'components/bootstrap/dist/css/bootstrap.min.css',
      'css/docs.css'
    ]
  };
};