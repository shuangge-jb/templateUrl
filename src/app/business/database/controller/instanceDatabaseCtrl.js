define(["src/app/business/database/config/config"], function(config) {
  function instanceDatabaseCtrl($scope, i18n, databaseService) {
    $scope.rds = "rds";
    console.log("getName", databaseService.getName());
    console.log(i18n.RDS);
  }
  angular
    .module("myApp")
    .tinyController("instanceDatabaseCtrl", [
      "$scope",
      "i18n",
      "databaseService",
      instanceDatabaseCtrl
    ]);
});
