define(["fixtures/drdsFixture"], function() {
  function instanceRedisCtrl($scope, camel) {
    $scope.redis = "redis";
    // console.log('camel get orders:',camel.getOrders());
    console.log('camel get instaces:',camel.getInstances());
  }
  angular
    .module("myApp")
    .tinyController("instanceRedisCtrl", ['$scope','camel',instanceRedisCtrl]);
});
