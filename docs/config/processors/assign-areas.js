"use strict";

var _ = require('lodash');
var path = require('canonical-path');

module.exports = function assignAreasProcessor(log) {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['processing-docs'],
    $process: function(docs) {
      // We are only interested in jsdoc docs
      // _.filter(docs, function(doc) {
      //   return doc.docType === 'js';
      // })
      // // All js docs go in the "api" area
      // .forEach(function (doc) {
      //   doc.area = 'api';
      // });

      _(docs)
        .forEach(function (doc) {
          if (doc.docType === 'js') {
            doc.area = 'api';
          }
          else if (doc.docType === 'content') {
            doc.area = 'tutorial';
          }
        });
    }
  };
};
