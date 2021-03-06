!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Smeans=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! smeans - v0.0.0 - 2014-12-18
* https://github.com/c0bra/smeans.js
* Copyright (c) 2014 Brian Hann; Licensed MIT */

'use strict';

function Smeans() { }

Smeans.cluster = cluster;
Smeans.distance = distance;
Smeans.centroid = centroid;
Smeans.closest = closest;

/**
* @ngdoc function
* @name cluster
* @param {Array} elements - An array of N-element arrays where each element is a number.
* @param {object} options - A set of options to pass to the clustering function
* @description

    Cluster takes an array of number-arrays like so:
    <pre>
      smeans.cluster([
        [0, 0],
        [1, 1],
        [20, 30],
        [40, 2]
      ]);
    </pre>
    ... and groups them into "clusters" according to Euclidean-distance similarity.
*/
function cluster(elements, opts) {
  /*jshint -W004 */

  if (!Array.isArray(elements)) {
    throw new Error("Elements argument is not an array");
  }

  if (elements.length === 0) { return []; }

  opts = opts ? opts : {
    k: null,
    clusters: null
  };

  var i,
      ci,
      ei,
      e,
      diff,
      tot_diff = 0,
      diffs    = [];

  // Get the variance and std dev for the distances between elements
  for (var i = 1, el = elements.length; i < el; i++) { // Skip the 0th element since nothing precedes it
    diff = Smeans.distance(elements[ i ], elements[ i - 1 ]);
    tot_diff += diff;
    diffs.push(diff);
  }
  var mean_diff = tot_diff / diffs.length;

  // Get the variance & std dev
  var sum_diff_variance = 0;
  for (var i = 0, dl = diffs.length; i < dl; i++) {
    diff = diffs[i];
    sum_diff_variance += Math.pow(diff - mean_diff, 2);
  }
  var diff_variance = sum_diff_variance / diffs.length;
  var diff_stdev = Math.sqrt(diff_variance);


  /* S-means */
  // Flag for whether the clusters are changing or not, stop when it's 0
  var changing = true;

  // Initial number of clusters
  var k         = opts.k ? opts.k : 1;
  // Similarity threshold
  var threshold = diff_stdev;

  // Randomly choose [k] centroids from among the data points
  var cluster_map = {};
  if (opts.clusters) {
    // Clear out the cluster elements
    cluster_map = opts.clusters;

    for (var ci in cluster_map) {
      var cluster = cluster_map[ci];
      cluster.elements = {};
    }
  }

  // No clusters pre-defined, pick a random element and make it the first cluster
  if (Object.keys(cluster_map).length === 0) {
    for (var i = 1; i <= k; i++) {
      var centroid = elements[Math.floor(Math.random() * elements.length)];

      cluster_map[i] = {
        i: i,
        centroid: centroid,
        elements: {}
      };
    }
  }

  while (changing) {
    // Flag for if a new cluster was made this iteration
    var new_cluster = false;

    // For each data point
    for (var ei = 0, el = elements.length; ei < el; ei++) {
      e = elements[ei];

      var closest_dist    = null; // Closest distance to this data point
      var closest_cluster = null; // Closest centroid to this data point

      // For each cluster
      for (var ci in cluster_map) {
        cluster = cluster_map[ci];

        // Get the distance from this point to the cluster centroid
        var dist = Math.abs(Smeans.distance(e, cluster.centroid));

        // If this distance is closer than the closest recorded distance, reset the closest
        //   distance and cluster
        if (closest_dist === null || dist < closest_dist) {
          closest_dist    = dist;
          closest_cluster = cluster;
        }
      }

      // If the distance is below the threshold, or the distance is 0, add it to this cluster
      if (closest_dist < threshold || closest_dist === 0) {
        closest_cluster.elements[e] = e;
      }
      // Otherwise create a new cluster with this data point as the centroid,
      //   also add this data point to the new cluster
      else {
        // Get the index of the new cluster
        var max_ci = 0;
        // max_ci = i for i, val of cluster_map when i > max_ci
        for (var cmi in cluster_map) {
          var max_cluster = cluster_map[cmi];

          if (max_ci < max_cluster.i) {
            max_ci = max_cluster.i;
          }
        }

        max_ci++;

        cluster_map[ max_ci ] = {
          i:        max_ci,
          centroid: e,
          elements: {}
        };

        cluster_map[max_ci].elements[e] = e;

        // *** This seems to make it never return...
        // new_cluster = true;
      }
    }

    var cluster_changed = false;

    // For each cluster
    for (var ci in cluster_map) {
      cluster = cluster_map[ci];

      // Delete clusters that have no elements
      var cluster_elms = Object.keys(cluster.elements);
      if (cluster_elms.length === 0) {
        delete cluster_map[ ci ];
        continue;
      }

      // Calculate the average Euclidean distance to each of its elements (since we're one dimensional here it's just the mean)
      var cluster_vals = [];
      for (var i = 0, cl = cluster_elms.length; i < cl; i++) {
        var ce = cluster_elms[i];
        cluster_vals.push(cluster.elements[ce]);
      }

      var new_centroid = Smeans.centroid(cluster_vals);

      // If this newly calculated centroid is different than the current one, assign it
      if (Smeans.distance(new_centroid, cluster.centroid) !== 0) {
        cluster.centroid = new_centroid;

        // Flip the cluster changed flag
        cluster_changed = true;
      }
    }

    // If no cluster was changed and no new cluster was created, we're done clustering
    if (!cluster_changed && !new_cluster) {
      changing = false;
    }
  }

  return cluster_map;
}

/**
* @ngdoc function
* @name distance
* @param {object} point1 - An N-element array of numbers
* @param {object} point2 - An N-element array of numbers
* @description Calculate distance between two points in N-space
*/
function distance(d1, d2) {
  // Build an array of distance squares
  var tot = 0;
  for (var i = 0, l = d1.length; i < l; i++) {
    var dist = d1[i] - d2[i];
    tot += dist * dist;
  }

  return Math.sqrt(tot);
}

function closest(point, points) {
  var closest_dist = Infinity,
      closest_point;

  for (var i = 0, pl = points.length; i < pl; i++) {
    var check_point = points[i];
    var dist = distance(point, check_point);

    if (dist < closest) {
      closest_dist = dist;
      closest_point = check_point;
    }
  }

  return closest_point;
}

function centroid(elements) {
  /*jshint -W004 */

  var l = elements[0].length;
  var el = elements.length;

  var dims = [];
  for (var i = 0; i < l; i++) {
    dims[i] = dims[i] = 0;
  }

  for (var ei = 0; ei < el; ei++) {
    for (var i = 0; i < l; i++) {
      dims[i] += elements[ei][i];
    }
  }

  var centroid = [];
  for (var i = 0; i < l; i++) {
    centroid[i] = dims[i] / el;
  }

  return centroid;
}

module.exports = Smeans;

},{}]},{},[1])(1)
});