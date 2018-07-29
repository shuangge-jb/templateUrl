define(["src/app/business/database/config/config"], function(config) {
  function instanceDatabaseCtrl($scope, databaseService) {
    $scope.rds = "rds";
    console.log("databaseService", databaseService.getName());
  }
  angular
    .module("myApp")
    .controller("instanceDatabaseCtrl", [
      "$scope",
      "databaseService",
      instanceDatabaseCtrl
    ]);
});
