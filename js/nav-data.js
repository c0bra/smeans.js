// Meta data used by the docs app
angular.module('navData', [])
  .value('NAV_DATA', {
  "tutorial": {
    "id": "tutorial",
    "name": "Tutorial",
    "pages": [
      {
        "name": "Start",
        "path": "Tutorial",
        "area": "tutorial"
      }
    ]
  },
  "api": {
    "id": "api",
    "name": "API",
    "pages": [
      {
        "name": "cluster",
        "path": "api/./function/cluster",
        "area": "api"
      },
      {
        "name": "distance",
        "path": "api/./function/distance",
        "area": "api"
      }
    ]
  }
});