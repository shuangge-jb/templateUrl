const lazyLoadModule = require("app/framework/lazyLoad").default;

export default function myApp(i18n) {
  "use strict";
  var myApp = angular.module("myApp", ["ui.router"]);
  myApp.value("i18n", i18n);
  myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    //用于设置默认的视图
    $urlRouterProvider.when("", "/database");
    //配置跳转的视图，包括一级视图和二级视图
    //一级视图对应的是菜单
    //二级视图对应的是子页面
    $stateProvider
      .state("database", {
        url: "/database",
        templateUrl: "leftMenu.html"
      })
      // .state("http", { url: "/http", templateUrl: "http.html" })
      .state("database.instance_database", {
        url: "/instance_database",
        templateUrl: "instance_database.html",
        controller: "instanceDatabaseCtrl",
        resolve: {
          lazyLoad: function() {
            // return new Promise((resolve, reject) => {
            //   return require.ensure(
            //     [],
            //     require => {
            //       resolve(require("app/business/database/database"));
            //     },
            //     err => reject(err), 
            //     "database"
            //   );
            // });
            return import(/* webpackChunkName: "database" */ "app/business/database/database");
          }
        }
      })
      .state("database.instance_redis", {
        url: "/instance_redis",
        templateUrl: "instance_redis.html",
        controller: "instanceRedisCtrl",
        resolve: {
          lazyLoad: function() {
            return new Promise((resolve, reject) => {
              return require.ensure(
                [],
                require => resolve(require("app/business/redis/redis")),
                err => reject(err),
                "redis"
              );
            });
          }
        }
      });
    // .state("database.packupPolicy", { url: "/packupPolicy", templateUrl: "page/packupPolicy.html" })
    // .state('database.add', { url: '/add', templateUrl: 'page/add.html' })
    // .state("database.packupHistory", { url: "/packupHistory", templateUrl: "page/packupHistory.html" });
  });
  // myApp.value('i18n',i18n);
  lazyLoadModule.makeLazy(myApp);
  return myApp;
}
