
angular.module('docsApp', ['ngRoute', 'navData', 'pagesData', 'docs.bootstrap'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/index.html'
    })
    .when('/doc/:path*', {
      controller: 'DocsController',
      templateUrl: function(urlattr) {
        return '/partials/' + urlattr.path + '.html';
      },
      resolve: {
        $route: function ($route) {
          return $route;
        }
      }
    });
})

.controller('DocsController', function ($log, $scope, DOCS_PAGES, NAV_DATA, $route) {
  $scope.DOCS_PAGES = DOCS_PAGES;
  $scope.NAV_DATA = NAV_DATA;
  $scope.$route = $route;

  this.include = function (path) {
    $scope.includePath = path;
  }

  this.getIncludePath = function () {
    return $scope.includePath
      ? '/partials/' + $scope.includePath + '.html'
      : null;
  };

  this.linkClass = function (doc) {
    if (!$route.current) { return; }

    var path = doc.path.replace(/\.\//, '');
    
    if ($route.current.params.path === path) { return 'active'; }
  };
})

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});


// .controller('PageController', function ($scope, $route) {
//   $scope.$route = $route;
// })