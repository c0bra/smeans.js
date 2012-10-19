smeans = undefined
VERSION = "0.0.1"

# check for nodeJS
hasModule = (typeof module isnt "undefined" and module.exports)

Smeans = ->
smeans = ->
  new Smeans()

#
# Exposing Smeans (stolen from moment.js)
#

# Cluster a list of elements
smeans.cluster = (elements) ->
  # validate 'elements' arg

  # Get the variance and std dev for the distances between elements
  tot_diff = 0
  diffs    = []
  for i in [1..elements.length-1] #Skip the 0th element since nothing precedes it
    diff = elements[ i ] - elements[ i - 1 ]

    tot_diff += diff
    diffs.push diff

  mean_diff = tot_diff / diffs.length
  
  # Get the variance & std dev
  sum_diff_variance = 0
  for diff in diffs
    sum_diff_variance += Math.pow(diff - mean_diff, 2)
  
  diff_variance = sum_diff_variance / diffs.length
  diff_stdev = Math.sqrt diff_variance

  clusters = {}

  ## S-means
  changing  = 1 # Flag for whether the clusters are changing or not, stop when it's 0
  k         = 1 # Initial number of clusters
  threshold = diff_stdev # Similarity threshold

  # Randomly choose [k] centroids from among the data points
  # *** Could we use k-means++ here instead?
  cluster_map = {};
  for i in [1..k]
    # centroid = elements[rand @dates]
    centroid = elements[Math.floor(Math.random() * elements.length)]

    cluster_map[i] = {
      'i': i,
      'centroid': centroid,
      'elements': []
    }

  while changing == 1
    # Flag for if a new cluster was made this iteration
    new_cluster = 0

    # For each data point
    for e in elements
      closest_dist    = null # Closest distance to this data point
      closest_cluster = null # Closest centroid to this data point

      # For each cluster
      # while (my ($ci, $cluster) = each %cluster_map) {
      for ci, cluster of cluster_map
        # Get the distance from this point to the cluster centroid
        dist = Math.abs(e - cluster.centroid)

        # If this distance is closer than the closest recorded distance, reset the closest
        #   distance and cluster
        if !closest_dist? || dist < closest_dist
          closest_dist    = dist
          closest_cluster = cluster
      
      # If the distance is below the threshold, add it to this cluster
      if closest_dist < threshold
        closest_cluster.elements.push e
      
      # Otherwise create a new cluster with this data point as the centroid,
      #   also add this data point to the new cluster
      else
        max_ci = 0
        max_ci = i for i, val of cluster_map when i > max_ci

        max_ci++

        cluster_map[ max_ci ] = {
          'i':        max_ci,
          'centroid': e,
          'elements': []
        }

        cluster_map[max_ci].elements.push e

    cluster_changed = 0
    
    # For each cluster
    for ci, cluster of cluster_map
      # Delete clusters that have no elements
      if cluster.elements.length == 0
        # console.log "Deleting!"
        delete cluster_map[ ci ]
        continue
  
      # Calculate the average Euclidean distance to each of its elements (since we're one dimensional here it's just the mean)
      tot   = 0
      count = 0
      for e in cluster.elements
        tot += e
        count++
        # console.log "E: #{e}, count: #{count}"
      
      new_centroid = tot / count

      # console.log "New c: #{new_centroid}"
      
      #If this newly calculated centroid is different than the current one, assign it
      if new_centroid != cluster.centroid
        cluster.centroid = new_centroid
        
        # Flip the cluster changed flag
        cluster_changed = 1
    
    # If no cluster was changed and no new cluster was created, we're done clustering
    if ! cluster_changed
      changing = 0

  return cluster_map

module.exports = smeans  if hasModule
this["smeans"] = smeans  if typeof ender is "undefined"
if typeof define is "function" and define.amd
  define "smeans", [], ->
    smeans