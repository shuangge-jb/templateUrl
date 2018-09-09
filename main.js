function getLang() {
  const lang = window.navigator.browserLanguage || window.navigator.language;
  const langFormat = lang.toLowerCase();
  return langFormat === "zh-cn" ? "zh-CN" : "en-US";
}
if (!window.urlParams) {
  window.urlParams = getLang();
}
const DDM_PATH = process.env.NODE_ENV === "development" ? "./" : "./";
window.require.config({
  baseUrl: "./",
  i18n: DDM_PATH + "i18n/" + window.urlParams.lang
});
// require(['src/app/router/routeConfig',
//         'src/app/controller/instanceDatabaseCtrl',
//         'src/app/controller/instanceRedisCtrl',
//         'src/app/service/databaseService'
//     ],
//     function(router, instanceDatabaseCtrl, instanceRedisCtrl, databaseService) {

//         angular.bootstrap(document, [router.name]);
//     });

// require('./ddm_main');
// window.require(['businessAll']);
