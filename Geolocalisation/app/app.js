/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/topojson.d.ts" />
(function () {
    var app = angular.module('app', ['ui.router']);
    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider.state('uk', {
            controller: 'zoomController',
            controllerAs: 'vm',
            url: '/uk',
            templateUrl: 'app/routes/zoom/zoom.html'
        }).state('home', {
            url: '/home',
            templateUrl: 'app/routes/home/home.html'
        });
    });
    app.controller('ctrl', ['$scope', function ($scope) {
        $scope.title = 'Hello, World!';
        try {
            var path = 'data/uk.json';
            var width = 800;
            var height = 600;
        }
        catch (e) {
            console.error(e);
        }
    }]);
})();
//# sourceMappingURL=app.js.map