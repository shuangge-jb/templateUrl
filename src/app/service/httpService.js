define([], function() {
    function httpService() {
        this.get = function() {
            return new Promise((resolve, reject) => {
                resolve('get response');
            });
        }
    }
    return angular.module('framework').service('camel', httpService);
});