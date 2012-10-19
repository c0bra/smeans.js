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
cluster = (elements) ->
  # validate 'elements' arg

  # Get the variance and std dev for the distances between elements
  tot_diff = 0
  diffs    = []
  for i in [1..elements.length] #Skip the 0th element since nothing precedes it
    diff = elements[ i ] - elements[ i - 1 ]
    tot_diff += diff
    diffs.push diff
  
  mean_diff = tot_diff / diffs.length
  
  # Get the variance & std dev
  sum_diff_variance = 0
  for i in diffs
    diff = diffs[i]
    sum_diff_variance += (diff - mean_diff) ** 2
  
  diff_variance = sum_diff_variance / diffs.length
  diff_stdev = Math.sqrt diff_variance

  clusters = {}

  ## S-means
  changing  = 1 # Flag for whether the clusters are changing or not, stop when it's 0
  k         = 1 # Initial number of clusters
  threshold = diff_stdev # Similarity threshold

  



module.exports = smeans  if hasModule
this["smeans"] = smeans  if typeof ender is "undefined"
if typeof define is "function" and define.amd
  define "smeans", [], ->
    smeans