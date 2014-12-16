'use strict';

var _ = require('lodash');
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));

var smeans = require('../lib/smeans.js');

describe('smeans', function () {
  it('works', function () {
    (true).should.equal(true);
  });

  xit('clusters an array of points', function () {
    var pts = [[1, 0], [2, 0], [3, 0], [100, 0], [101, 0], [102, 0]];

    var clusters = smeans.cluster(pts);
    console.log(clusters);

    _.forIn(clusters, function(cluster, i) {
      cluster.centroid.should.not.be.an('undefined');

      if ( (_.difference(cluster.centroid, [101, 0])).length === 0 ) {
        cluster.elements.should.deep.equal([[100, 0], [103, 0], [102, 0]]);
      }
      else if ( (_.difference(cluster.centroid, [2, 0])).length === 0 ) {
        cluster.elements.should.deep.equal([[1, 0], [2, 0], [3, 0]]);
      }
      else {
        cluster.centroid.should.be.an('undefined', 'There should not be another centroid possible');
      }
    });
  });
});
