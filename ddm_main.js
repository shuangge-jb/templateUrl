const framework = require("./framework");
const businessModule = require("./index");
const businessCtrl = require("./businessAll.build");

framework.default().then(fr => {
  // businessModule.default().then(bu => {
  //     businessCtrl.default();
  //     angular.bootstrap(document, [fr, bu].map(item => item.name));
  // });
  
  const bu = businessModule.default();
  businessCtrl.default();
  angular.bootstrap(window.document, [fr, bu].map(item => item.name));
});
