var lazy = angular.module("lazy", ["ui.router"]);
lazy.makeLazy = function(module) {
  module.config(function(
    $controllerProvider,
    $provide,
    $compileProvider,
    $filterProvider
  ) {
    module.tinyController = $controllerProvider.register;
    module.tinyService = $provide.service;
    module.tinyFilter = $filterProvider.register;
    module.tinyDirective = $compileProvider.directive;
  });
};

export default lazy;
