const framework = require("./framework");
const businessModule = require("./index").default;
const businessCtrl = require("./businessAll.build");
const getI18nPromise = require("./i18n").default;

const data = {};
Promise.all([
  framework.default(),
  getI18nPromise(
    window.urlParams && window.urlParams.lang ? window.urlParams.lang : "zh-cn"
  )
]).then(array => {
  const fr = array[0];
  const i18n = array[1];
  const bu = businessModule.default(i18n);
  businessCtrl.default();
  angular.bootstrap(window.document, [fr, bu].map(item => item.name));
});
