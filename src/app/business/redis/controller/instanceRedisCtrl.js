define(["fixtures/drdsFixture"], function() {
  function instanceRedisCtrl($scope, $timeout, camel, redisService) {
    $scope.redis = "redis";
    console.log("camel get orders:", camel.getOrders());
    console.log("camel get instaces:", camel.getInstances());
    const promise = redisService.get();
    console.log("$.Deferred $.get .promise():", promise);
    const promise11 = redisService.get11();
    console.log("$.Deferred $.get:", promise11);
    const promise2 = redisService.get2();
    console.log("$q.defer $http.get  .promise:", promise2);
    const promise22 = redisService.get22();
    console.log("$q.defer $http.get:", promise22);
    const promise3 = redisService.get3();
    console.log("$q.defer  $.get  .promise:", promise3);
    const promise33 = redisService.get33();
    console.log("$q.defer  $.get:", promise33);
    const promise4 = redisService.get4();
    console.log("$.Deferred  $http.get  .promise():", promise4);
    const promise44 = redisService.get44();
    console.log("$.Deferred  $http.get:", promise44);
    const promise5 = redisService.get5();
    console.log("$.get:", promise5);
    const promise6 = redisService.get6();
    console.log("$http.get:", promise6);
    promise
      .then(data => {
        console.log("first promise:", data);
        return data;
      })
      .then(data => {
        console.log("second promise:", data);
      });
    // Promise.all([promise,promise2]).then(array=>{
    //   console.log(array);
    // });
  }
  angular
    .module("myApp")
    .tinyController("instanceRedisCtrl", [
      "$scope",
      "$timeout",
      "camel",
      "redisService",
      instanceRedisCtrl
    ]);
});
