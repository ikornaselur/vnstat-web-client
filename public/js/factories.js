angular.module('vnstatApp').factory('stats', ['$http', function ($http) {
  var endpoint = '/vnstat';
  return {
    'get': function (suc, err) {
      return $http.get(endpoint).success(suc).error(err);
    }
  };
}]);
