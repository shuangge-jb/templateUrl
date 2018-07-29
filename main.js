function getLang() {
  const lang = window.navigator.browserLanguage || window.navigator.language;
  const langFormat = lang.toLowerCase();
  return langFormat === "zh-cn" ? "zh-CN" : "en-US";
}
if (!window.urlParams) {
  window.urlParams = getLang();
}
window.require.config({
  baseUrl: "./",
  i18n: "./i18n" + window.urlParams.lang
});
// require(['src/app/router/routeConfig',
//         'src/app/controller/instanceDatabaseCtrl',
//         'src/app/controller/instanceRedisCtrl',
//         'src/app/service/databaseService'
//     ],
//     function(router, instanceDatabaseCtrl, instanceRedisCtrl, databaseService) {

//         angular.bootstrap(document, [router.name]);
//     });

// window.require(['businessAll']);
