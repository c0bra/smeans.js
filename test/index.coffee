smeans = require("../smeans")

chai = require("chai")
should = chai.should()

pts = [1, 2, 3, 100, 101, 102]

describe "clustering", ->
  describe "with 1,2,3 and 101,101,102", ->
    it "returns two clusters", ->
      smeans.cluster pts