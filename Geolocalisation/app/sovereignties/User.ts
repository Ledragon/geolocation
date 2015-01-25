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
        constructor(private $scope: IUserScope, private $rootScope: ng.IRootScopeService) {
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
                self.$scope.$apply();
            }, () => { });

        }
    }
    var app = angular.module('app');
    app.controller(User.controllerId, ['$scope', '$rootScope', ($scope, $rootScope) => new User($scope, $rootScope)]);
} 