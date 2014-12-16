"use strict";

var _ = require('lodash');
var path = require('canonical-path');

module.exports = function generatePagesDataProcessor() {
  $runAfter: ['paths-computed'],
  $runBefore: ['rendering-docs'],
  $process: function(docs) {
    
  }
};
