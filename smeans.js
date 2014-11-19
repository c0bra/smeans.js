(function () {

  function Smeans() { }

  Smeans.cluster = cluster;
  Smeans.distance = distance;
  Smeans.new_cluster = new_cluster;
  Smeans.centroid = centroid;

  function cluster(elements, k) {
    if (!Array.isArray(elements)) {
      throw new Error("Elements argument is not an array");
    }

    if (elements.length === 0) { return []; }

    var i,
        ci,
        ei,
        e,
        diff,
        cluster,
        clusters = {},
        tot_diff = 0,
        diffs    = [];

    // Get the variance and std dev for the distances between elements
    for (var i = 1; i < elements.length; i++) { // Skip the 0th element since nothing precedes it
      diff = elements[ i ] - elements[ i - 1 ];
      tot_diff += diff;
      diffs.push(diff);
    }
    var mean_diff = tot_diff / diffs.length;

    // Get the variance & std dev
    var sum_diff_variance = 0;
    for (var i = 0; i < diffs.length; i++) {
      diff = diffs[i];
      sum_diff_variance += Math.pow(diff - mean_diff, 2);
    }
    var diff_variance = sum_diff_variance / diffs.length;
    var diff_stdev = Math.sqrt(diff_variance);


    /* S-means */
    // Flag for whether the clusters are changing or not, stop when it's 0
    var changing = true;

    // Initial number of clusters
    k             = k ? k : 1;
    // Similarity threshold
    var threshold = diff_stdev;

    // Randomly choose [k] centroids from among the data points
    var cluster_map = {};
    for (var i = 1; i <= k; i++) {
      var centroid = elements[Math.floor(Math.random() * elements.length)];

      cluster_map[i] = {
        i: i,
        centroid: centroid,
        elements: {}
      };
    }

    while (changing) {
      // Flag for if a new cluster was made this iteration
      var new_cluster = false;

      // For each data point
      for (var ei = 0; ei < elements.length; ei++) {
        e = elements[ei];

        var closest_dist    = null; // Closest distance to this data point
        var closest_cluster = null; // Closest centroid to this data point

        // For each cluster
        for (var ci in cluster_map) {
          cluster = cluster_map[ci];

          // Get the distance from this point to the cluster centroid
          var dist = Math.abs(e - cluster.centroid);

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
          //max_ci = i for i, val of cluster_map when i > max_ci
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
        var tot   = 0;
        var count = 0;
        for (var cei = 0; cei < cluster_elms.length; cei++) {
          e = cluster.elements[cluster_elms[cei]];
          tot += e;
        }
        
        new_centroid = tot / cluster_elms.length;
        
        // If this newly calculated centroid is different than the current one, assign it
        if (new_centroid != cluster.centroid) {
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
  };

  function new_cluster(elements, k) {
    if (!Array.isArray(elements)) {
      throw new Error("Elements argument is not an array");
    }

    if (elements.length === 0) { return []; }

    var i,
        ci,
        ei,
        e,
        diff,
        cluster,
        clusters = {},
        tot_diff = 0,
        diffs    = [];

    // Get the variance and std dev for the distances between elements
    for (var i = 1; i < elements.length; i++) { // Skip the 0th element since nothing precedes it
      diff = smeans.distance(elements[ i ], elements[ i - 1 ]);
      tot_diff += diff;
      diffs.push(diff);
    }
    var mean_diff = tot_diff / diffs.length;

    // Get the variance & std dev
    var sum_diff_variance = 0;
    for (var i = 0; i < diffs.length; i++) {
      diff = diffs[i];
      sum_diff_variance += Math.pow(diff - mean_diff, 2);
    }
    var diff_variance = sum_diff_variance / diffs.length;
    var diff_stdev = Math.sqrt(diff_variance);


    /* S-means */
    // Flag for whether the clusters are changing or not, stop when it's 0
    var changing = true;

    // Initial number of clusters
    k             = k ? k : 1;
    // Similarity threshold
    var threshold = diff_stdev;

    // Randomly choose [k] centroids from among the data points
    var cluster_map = {};
    for (var i = 1; i <= k; i++) {
      var centroid = elements[Math.floor(Math.random() * elements.length)];

      cluster_map[i] = {
        i: i,
        centroid: centroid,
        elements: {}
      };
    }

    while (changing) {
      // Flag for if a new cluster was made this iteration
      var new_cluster = false;

      // For each data point
      for (var ei = 0; ei < elements.length; ei++) {
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
          //max_ci = i for i, val of cluster_map when i > max_ci
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
        for (var i = 0; i < cluster_elms.length; i++) {
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
  };

  // Calculate distance between two points in N-space
  function distance(d1, d2) {
    var l = d1.length;

    // Build an array of distance squares
    var tot = 0;
    for (var i = 0; i < l; i++) {
      var dist = d1[i] - d2[i];
      tot += dist * dist;
    }

    return Math.sqrt(tot);
  }

  function centroid(elements) {
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

  window.smeans = Smeans;
})();
