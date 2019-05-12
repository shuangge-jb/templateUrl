import config from "src/app/business/database/config/config";
import SubCustom from "./subCustom";

function instanceDatabaseCtrl($scope, i18n, databaseService) {
  $scope.rds = "rds";
  console.log("getName", databaseService.getName());
  console.log(i18n.RDS);

  function getDupArray(array) {
    if (!array || !array.length) {
      return array;
    }
    const map = array.reduce((prev, cur) => {
      prev.set(cur, prev.has(cur) ? prev.get(cur) + 1 : 1);
      return prev;
    }, new Map());
    return Array.from(map.keys()).filter(item => map.get(item) > 1);
  }
  console.log("[1, 2, 3, 3, 4]:  ", getDupArray([1, 2, 3, 3, 4]));
  console.log("[1, 2, 3, 4]:  ", getDupArray([1, 2, 3, 4]));
  console.log("[]:  ", getDupArray([]));
  console.log("undefined:  ", getDupArray());
  console.log([...new Set([1, 2, 3, 3, 4])]);
  const sub = new SubCustom("subCustom");
  console.log("sub.instanceName:", sub.instanceName());
}
angular
  .module("myApp")
  .tinyController("instanceDatabaseCtrl", [
    "$scope",
    "i18n",
    "databaseService",
    instanceDatabaseCtrl
  ]);
