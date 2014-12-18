(function () {
var samplerMaker = randomSampler;

angular.module('docs.utils', [])

.directive('appCanvas', function ($log, $interval, $compile) {
  return {
    restrict: 'EA',
    scope: false,
    link: function ($scope, $elm, $attr) {
      var interval = 1;

      var el = $elm[0];
      var width = el.clientWidth,
          height = el.clientHeight;
      
      $scope.svg = d3.select(el).append('svg').attr({width: width, height: height});
    },
    controller: function ($scope) {
      this.svg = function () {
        return $scope.svg;
      };
    }
  };
})

.directive('ballGenerator', function ($log, $interval, $compile) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      clusters: '=',
      stopped: '='
    },
    link: function ($scope, $elm, $attr) {
      var interval = 1;

      var el = $elm[0];
      var width = el.clientWidth,
          height = el.clientHeight;
      var r = 4;
      var edgeDist = r + 10;
      var svg = d3.select(el).append('svg').attr({width: width, height: height});
      
      var sample = samplerMaker(width, height, edgeDist);
      
      $scope.$watch(function() { return samplerMaker; }, function (n, o) {
        if (n !== o) {
          $log.debug('Sampler changed!');
          sample = n(width, height, edgeDist);
          
          svg.selectAll('circle').remove();
          $scope.data.length = 0;
        }
      });      

      var clusterpoints = [];
      $scope.$watchCollection('clusters', function(n, o) {
        if (n && n !== o) {
          for (var ci in n) {
            var cluster = n[ci];
            
            if (clusterpoints[cluster.i]) {
              clusterpoints[cluster.i].remove();
            }
            
            var circle = svg.append('circle')
              .attr('class', 'centroid')
              .attr('r', r)
              .attr('cx', cluster.centroid[0])
              .attr('cy', cluster.centroid[1]);
            
            clusterpoints[cluster.i] = circle;
          }
        }
      });
      
      var circles = svg.selectAll("circle");
      
      var x = d3.scale.linear()
                .domain([0, width])
                .range([0, width]);
    
      var y = d3.scale.linear()
                .domain([0, height])
                .range([0, height]);
      
      function add_circle() {
        var pos = sample();
        if (!pos) { return; }
        
        var circle = svg.append('circle')
          .attr('class', 'ball')
          .attr('r', r)
          .attr('cx', pos[0])
          .attr('cy', pos[1]);
        
        $scope.data.push(pos);
        
        var line;
        
        var watchDereg = $scope.$watchCollection('clusters', function(n, o) {
          var myCluster = belongsToCluster(pos, n);
          if (myCluster !== undefined) {
            if (line && line.remove) { line.remove(); }
            
            line = svg.append('line')
              .style('stroke', 'gray')  // colour the line
              .attr('class', 'line')
              .attr("x1", pos[0])     // x position of the first end of the line
              .attr("y1", pos[1])      // y position of the first end of the line
              .attr("x2", myCluster.centroid[0])     // x position of the second end of the line
              .attr("y2", myCluster.centroid[1]);
          }
          else if (line && line.remove){ line.remove(); }
        });
        
        if (false) {
          circle
            .transition()
            .duration(interval * 160)
            .style('opacity', 0)
            .remove()
            .each('end', function () {
              $scope.data.splice($scope.data.indexOf(pos), 1);
              watchDereg();
              // $newScope.$destroy();
            });
        }
      }
      
      // $interval(function () {
      //   if (!$scope.stopped) {
      //     add_circle();
      //   }
      // }, interval);
      
      function belongsToCluster(point, clusters) {
        for (var ci in clusters) {
          var cluster = clusters[ci];
          if (inCluster(point, cluster)) {
            return cluster;
          }
        }
      }
      
      function clusterIndex(point, clusters) {
        for (var ci in clusters) {
          var cluster = clusters[ci];
          if (inCluster(point, cluster)) {
            return ci;
          }
        }
      }
      
      function inCluster(point, cluster) {
        if (point in cluster.elements) {
          return true;
        }
        else {
          return false;
        }
      }
    }
  };
});

function randomSampler(width, height, r) {
  return function () {
    return [
       Math.floor(Math.random() * (width - r*2 + 1)) + r,
       Math.floor(Math.random() * (height - r*2 + 1)) + r
    ];
  };
}

})();