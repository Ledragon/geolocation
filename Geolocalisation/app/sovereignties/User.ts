module Utils {
    export interface IUserScope extends ng.IScope {
        vm: IUser;
    }

    export interface IUser {
        user: Models.user;
        add(): void;
        locate(): void;

    }
    export class User implements IUser {
        static controllerId: string = 'User';
        user: Models.user;
        constructor(private $scope: IUserScope, private $rootScope: ng.IRootScopeService, private mapService: Services.IMapService) {
            $scope.vm = this;
            this.user = new Models.user('', '');
        }

        add(): void {
            if (this.user.name && this.user.country) {
                this.$rootScope.$broadcast('user-added', this.user);
            }
        }

        locate(): void {
            var self = this;
            var position = navigator.geolocation.getCurrentPosition((position) => {
                self.user.latitude = position.coords.latitude;
                self.user.longitude = position.coords.longitude;
                var country = self.mapService.getCountry(self.user.longitude, self.user.latitude);
                if (country) {
                    self.user.country = country.properties.name;
                }
                self.$scope.$apply();
            }, () => { });
        }

        position(){
            var country = this.mapService.getCountry(this.user.longitude, this.user.latitude);
            if (country) {
                this.user.country = country.properties.name;
            }
            this.mapService.plot(this.user.longitude, this.user.latitude);
        }
    }
    var app = angular.module('app');
    app.controller(User.controllerId,
        ['$scope', '$rootScope', 'mapService', ($scope, $rootScope, mapService) => new User($scope, $rootScope, mapService)]);
} 