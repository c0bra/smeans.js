
angular.module('docsApp', ['pagesData'])

.controller('DocsController', function ($scope, DOCS_PAGES) {
  $scope.DOCS_PAGES = DOCS_PAGES;
});