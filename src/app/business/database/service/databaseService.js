function databaseService() {
    this.getName = function() {
        return 'databaseService';
    };
    return this;
}
angular.module('myApp').service('databaseService', databaseService);