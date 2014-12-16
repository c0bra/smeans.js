"use strict";

var _ = require('lodash');
var path = require('canonical-path');

module.exports = function generateIndexPagesProcessor() {
  return {
    name: 'index-page',
    // deployments: [],
    $validate: {
      deployments: { presence: true }
    },
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    description: 'Create documentation index page',
    template: 'indexPage.template.html',
    $process: function(docs) {

      // Collect up all the areas in the docs
      var areas = {};
      docs.forEach(function(doc) {
        if ( doc.area ) {
          areas[doc.area] = doc.area;
        }
      });
      areas = _.keys(areas);

      this.deployments.forEach(function(deployment) {

        var indexDoc = _.defaults({
          docType: 'indexPage',
          areas: areas
        }, deployment);

        indexDoc.id = 'index' + (deployment.name === 'default' ? '' : '-' + deployment.name);

        docs.push(indexDoc);
      });

      // docs.push({
      //   docType: 'indexPage',
      //   areas: areas,
      //   id: 'index'
      // });
    }
  };
};