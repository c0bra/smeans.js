"use strict";

var _ = require('lodash');
var path = require('canonical-path');

var AREA_NAMES = {
  api: 'API',
  tutorial: 'Tutorial',
};

module.exports = function generatePagesDataProcessor(log) {
  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      // We are only interested in docs that are in an area
      var pages = _.filter(docs, function(doc) {
        return doc.area;
      });

      var pageData = _.map(pages, function(page) {
        return _.pick(page, ['name', 'path', 'area']);
      });

      var areas = {};
      _(pages)
        .groupBy(function (page) { return page.area; })
        .forEach(function (areaDocs, areaId) {
          areas[areaId] = {
            id: areaId,
            name: AREA_NAMES[areaId],
            pages: []
          };
        });

      _(pageData)
        .forEach(function (page) {
          areas[page.area].pages.push(page);
        });

      docs.push({
        docType: 'pages-data',
        id: 'pages-data',
        template: 'pages-data.template.js',
        outputPath: 'js/pages-data.js',
        pages: pageData
      });

      docs.push({
        docType: 'nav-data',
        id: 'nav-data',
        template: 'nav-data.template.js',
        outputPath: 'js/nav-data.js',
        areas: areas
      });
    }
  };
};
