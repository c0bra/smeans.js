// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('smeans', [
  // require('dgeni-packages/jsdoc'),
  // require('dgeni-packages/nunjucks'),
  require('dgeni-packages/ngdoc'),
  require('dgeni-packages/examples')
])

.factory(require('./services/deployments/default'))

.processor(require('./processors/assign-areas'))
.processor(require('./processors/index-page'))
.processor(require('./processors/pages-data'))

.config(function (dgeni, log, readFilesProcessor, writeFilesProcessor) {
  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'debug';

  readFilesProcessor.basePath = path.resolve(__dirname,'../..');
  readFilesProcessor.sourceFiles = [
    { include: 'src/**/*.js', basePath: 'src' },
    { include: 'docs/content/**/*.md', basePath: 'docs/content', fileReader: 'ngdocFileReader' }
  ];

  writeFilesProcessor.outputFolder = 'build';
})

.config(function (templateFinder, templateEngine) {
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  templateFinder.templatePatterns = [
    '${ doc.docType }.template.html',
    'common.template.html'
  ];

  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };
})

.config(function (computePathsProcessor, computeIdsProcessor) {
  /* Ids */
  computeIdsProcessor.idTemplates.push({
    docTypes: ['indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['content'],
    idTemplate: 'content-${fileInfo.relativePath.replace("/","-")}',
    getAliases: function(doc) { return [doc.id]; }
  });

  /* Paths */
  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });

  // Put jsdoc files in ./partials directory
  computePathsProcessor.pathTemplates.push({
    docTypes: ['js'],
    pathTemplate: '${id}',
    outputPathTemplate: 'partials/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['content'],
    getPath: function(doc) {
      var docPath = path.dirname(doc.fileInfo.relativePath);
      if ( doc.fileInfo.baseName !== 'index' ) {
        docPath = path.join(docPath, doc.fileInfo.baseName);
      }
      return docPath;
    },
    getOutputPath: function(doc) {
      return path.join(
        'partials',
        path.dirname(doc.fileInfo.relativePath),
        doc.fileInfo.baseName) + '.html';
    }
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