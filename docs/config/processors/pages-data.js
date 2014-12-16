"use strict";

var _ = require('lodash');
var path = require('canonical-path');

module.exports = function generatePagesDataProcessor(log) {
  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      // We are only interested in jsdoc docs
      var pages = _.filter(docs, function(doc) {
        return doc.docType === 'js';
      });

      var pageData = _.map(pages, function(page) {
        return _.pick(page, ['name', 'path']);
      });

      log.warn(pageData);

      docs.push({
        docType: 'pages-data',
        id: 'pages-data',
        template: 'pages-data.template.js',
        outputPath: 'js/pages-data.js',
        pages: pageData
      });
    }
  };
};
