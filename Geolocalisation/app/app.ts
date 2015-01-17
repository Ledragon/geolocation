/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/topojson.d.ts" />
(function(){
    var app = angular.module('app', [    ]);

    app.controller('ctrl', ['$scope', function ($scope) {
        $scope.title = 'Hello, World!';
        try{
            var path = 'data/uk.json';
            var width = 800;
            var height = 600;

        //createUkMap(width, height, path);

            //var s = new Utils.Sovereignties();

        }
        catch(e){
            console.error(e);
        }
    }]);
})();