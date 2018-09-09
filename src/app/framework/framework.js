define([], function() {
    console.log('process.env.NODE_ENV',process.env.NODE_ENV);
    const framework = angular.module('framework', []);
    return framework;
});