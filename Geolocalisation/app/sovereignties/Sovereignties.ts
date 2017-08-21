/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
module Utils {
    export interface ISovereigntiesScope extends ng.IScope {
        vm: ISovereignties;
    }

    export interface ISovereignties {
        isLoading: boolean;
        countries: Array<any>;

        translateX: number;
        translateY: number;
        scale: number;

        userList: Array<Models.user>;

    }
    export class Sovereignties implements ISovereignties {
        isLoading: boolean;
        countries: Array<any>;
        selectedCountry: string;
        translateX = 0;
        translateY = 0;
        scale = 1;

        userList: Array<Models.user>;

        constructor(private $scope: ISovereigntiesScope, private mapService: Services.IMapService) {
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            this.selectedCountry = '';
            mapService.init('sovereignties');
            this.userList = [];


            var self = this;
            $scope.$on('user-added', (data, arg: Models.user) => {
                self.userList.push(arg);
                var country = mapService.getCountry(arg.longitude, arg.latitude);
                if (country) {
                    console.log(country);
                }
                mapService.plot(arg.longitude, arg.latitude);
            });
            $scope.$on('country-hover', (event, arg) => {
                self.selectedCountry = arg;
                self.$scope.$apply();
            });
        }

        reset() {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            //this.update();
        }
    }

    var app = angular.module('app');
    app.controller('Sovereignties', [
        '$scope', 'mapService', ($scope, mapService) => new Sovereignties($scope, mapService)]);
}