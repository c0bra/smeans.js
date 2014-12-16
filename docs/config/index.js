// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('smeans', [
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/examples')
])

.factory(require('./services/deployments/default'))

.processor(require('./processors/index-page'))

.config(function (dgeni, log, readFilesProcessor, writeFilesProcessor) {
  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';

  readFilesProcessor.basePath = path.resolve(__dirname,'../..');
  readFilesProcessor.sourceFiles = [
    { include: 'lib/**/*.js', basePath: 'src' },
    { include: 'docs/content/**/*.ngdoc', basePath: 'docs/content' }
  ];

  writeFilesProcessor.outputFolder = 'build';
})

.config(function (templateFinder) {
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  templateFinder.templatePatterns = [
    '${ doc.docType }.template.html',
    'common.template.html'
  ];
})

.config(function (computePathsProcessor, computeIdsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  // Put jsdoc files in ./partials directory
  computePathsProcessor.pathTemplates.push({
    docTypes: ['js'],
    pathTemplate: '${id}',
    outputPathTemplate: 'partials/${path}.html'
  });
})

.config(function (generateIndexPagesProcessor, generateExamplesProcessor, generateProtractorTestsProcessor, defaultDeployment) {
  generateIndexPagesProcessor.deployments = [defaultDeployment];

  generateExamplesProcessor.deployments = generateIndexPagesProcessor.deployments;
  generateProtractorTestsProcessor.deployments = generateIndexPagesProcessor.deployments;
});

// .config(function (log, readFilesProcessor, templateFinder, writeFilesProcessor, generateExamplesProcessor, generateProtractorTestsProcessor) {
//   // Deployments
//   var deployments = [
//     // { name: 'debug', ... },
//     {
//       name: 'default',
//       examples: {

//       }
//     }
//   ];

//   generateExamplesProcessor.deployments = deployments;
//   generateProtractorTestsProcessor.deployments = deployments;
// });