/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
var Utils;
(function (Utils) {
    var Sovereignties = (function () {
        function Sovereignties($scope, mapService) {
            this.$scope = $scope;
            this.mapService = mapService;
            this.translateX = 0;
            this.translateY = 0;
            this.scale = 1;
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            this.selectedCountry = '';
            mapService.init('sovereignties');
            this.userList = [];
            var self = this;
            $scope.$on('user-added', function (data, arg) {
                self.userList.push(arg);
                var country = mapService.getCountry(arg.longitude, arg.latitude);
                if (country) {
                    console.log(country);
                }
                mapService.plot(arg.longitude, arg.latitude);
            });
            $scope.$on('country-hover', function (event, arg) {
                self.selectedCountry = arg;
                self.$scope.$apply();
            });
        }
        Sovereignties.prototype.reset = function () {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            //this.update();
        };
        return Sovereignties;
    })();
    Utils.Sovereignties = Sovereignties;
    var app = angular.module('app');
    app.controller('Sovereignties', [
        '$scope',
        'mapService',
        function ($scope, mapService) { return new Sovereignties($scope, mapService); }
    ]);
})(Utils || (Utils = {}));
//# sourceMappingURL=Sovereignties.js.map