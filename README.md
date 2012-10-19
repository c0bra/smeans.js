## smeans.js

[![Build Status](https://secure.travis-ci.org/c0bra/smeans.js?branch=master)](http://travis-ci.org/c0bra/smeans.js)

S-Means clustering in javascript

### What?

S-Means is a clustering algorithm similar to [K-Means](http://en.wikipedia.org/wiki/K-means), but it does not need a initial value for K (number of clusters).

There is a white-paper on S-Means [here](http://www.ecmlpkdd2007.org/CD/workshops/IWKDUDS/papers/p3.pdf).

### Why?

Clustering data. when you don't know the initial number of clusters to use, is pretty hard. Deciding the value for K is the subject of a whole slew of papers. S-Means makes it easier. Let the algorithm decide.

<!-- ### How does it work?

The basics of S-Means is that it starts with one or more initial clusters, and while testing each data point against each cluster it:
1. moves the cluster centroid around to better fit its elements,
2. creates new one clusters, and
3. removes clusters with no elements,

until the clusters stop changing. -->

<!-- The basics of my implementation are:

1. Get the standard deviation of the distance between sequential data points. Use this as the similarity threshold
1. One of the supplied data points is randomly selected to the first centroid.
1. Test the distance of each data point against the centroid. If the distance is above the threshold, make that data point a NEW centroid
Then
1. Test each data point against  -->

### OK, how do I use it?

#### JavaScript

		var smeans = require('smeans');
		var data = [1, 2, 3, 101, 102, 103];
		var clusters = smeans.cluster(data);

		// clusters =
		{
			1: {
		        elements: [
		            1,
		            2,
		            3,
		        ],
		        i: 1,
		        centroid: 2
		    },
		    2: {
		        elements: [
		            101,
		            102,
		            103,
		        ],
		        i: 2,
		        centroid: 101
		    }
		}

#### CoffeeScript
	smeans = require('smeans')
	data = [1, 2, 3, 101, 102, 103]
	clusters = smeans.cluster data