define([], function() {
    var httpService =['$http',function($http) {
        this.getOrders = function() {
            
            return $http.get('/rest/v1.0/orders');
        };
        this.getInstances = function() {
            
            return $http.get('/rest/v1.0/instances');
        };
    }];
    return angular.module('framework').service('camel', httpService);
});