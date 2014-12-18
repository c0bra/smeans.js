"use strict";

module.exports = function debugDeployment() {
  return {
    name: 'debug',
    examples: {
      commonFiles: {
        scripts: [
          '//ajax.googleapis.com/ajax/libs/angularjs/1.3.7/angular.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js',
          '/js/docs.utils.js',
          '/js/smeans.js'
        ],
        stylesheets: [
          '/js/docs.utils.css'
        ]
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
      'js/docs.js',
      'js/smeans.js'
    ],
    stylesheets: [
      // 'components/bootstrap/dist/css/bootstrap.min.css',
      'css/docs.css'
    ]
  };
};