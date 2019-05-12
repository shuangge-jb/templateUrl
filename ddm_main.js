import framework from "./framework";
const businessModule = require("./index").default;
import businessCtrl from "./businessAll.build";
import getI18nPromise from "./i18n/index";

import toggle from "./toggle";
window.GLOBAL_SWITCH = toggle;

Promise.all([framework(), getI18nPromise(toggle.scene)]).then(array => {
  const [fr, i18n] = array;
  const bu = businessModule.default(i18n);
  businessCtrl();
  angular.bootstrap(window.document, [fr, bu].map(item => item.name));
});
