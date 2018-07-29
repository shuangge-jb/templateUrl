define(["fixtures/drdsFixture"], function() {
  function instanceRedisCtrl($scope, camel) {
    $scope.redis = "redis";
    console.log(camel.get());
  }
  angular
    .module("myApp")
    .controller("instanceRedisCtrl", ['$scope','camel',instanceRedisCtrl]);
});
