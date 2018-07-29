define([], function() {
  function utilService() {
    this.getLang = function() {
      var lang = window.navigator.browserLanguage || window.navigator.language;
      var langFormat = lang.toLowerCase();
      return langFormat === "zh-cn" ? "zh-CN" : "en-US";
    };
  }
  angular.module("framework").service("utilService", [utilService]);
});
