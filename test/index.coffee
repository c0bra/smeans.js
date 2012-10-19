smeans = require("../smeans")

chai = require("chai")
should = chai.should()

pts = [1, 2, 3, 100, 101, 102]

describe "clustering", ->
  describe "with 1,2,3 and 101,101,102", ->
    it "returns two clusters", ->
      cs = smeans.cluster pts
      count = 0
      count++ for k, v of cs
      count.should.equal 2

pts2 = [1, 2, 3, 4, 5, 6]

describe "clustering", ->
  describe "with 1,2,3,4,5,6", ->
    it "returns 6 clusters", ->
      cs = smeans.cluster pts2
      eyes.inspect cs
      count = 0
      count++ for k, v of cs
      count.should.equal 6