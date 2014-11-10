angular.module('vnstatApp').filter('formatDate', function () {
  return function (date) {
    return date.year + "-" + date.month + "-" + date.day;
  }
});

angular.module('vnstatApp').filter('formatGB', function () {
  return function (kb) {
    return parseFloat(kb/(1024*1024)).toFixed(2);
  }
});
