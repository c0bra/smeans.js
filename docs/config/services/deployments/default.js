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
      // 'components/angular/angular.min.js',
      // 'components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'components/google-code-prettify/src/prettify.js',
      'components/google-code-prettify/src/lang-css.js',
      'js/nav-data.js',
      'js/pages-data.js',
      'js/docs-bootstrap.js',
      'js/docs.js'
    ],
    stylesheets: [
      // 'components/bootstrap/dist/css/bootstrap.min.css',
      'css/docs.css'
    ]
  };
};