var Utils;
(function (Utils) {
    var User = (function () {
        function User($scope, $rootScope, mapService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.mapService = mapService;
            $scope.vm = this;
            this.user = new Models.user('', '');
        }
        User.prototype.add = function () {
            if (this.user.name && this.user.country) {
                this.$rootScope.$broadcast('user-added', this.user);
            }
        };

        User.prototype.locate = function () {
            var self = this;
            var position = navigator.geolocation.getCurrentPosition(function (position) {
                self.user.latitude = position.coords.latitude;
                self.user.longitude = position.coords.longitude;
                var country = self.mapService.getCountry(self.user.longitude, self.user.latitude);
                if (country) {
                    self.user.country = country.properties.name;
                }
                self.$scope.$apply();
            }, function () {
            });
        };

        User.prototype.position = function () {
            var country = this.mapService.getCountry(this.user.longitude, this.user.latitude);
            if (country) {
                this.user.country = country.properties.name;
            }
            this.mapService.plot(this.user.longitude, this.user.latitude);
        };
        User.controllerId = 'User';
        return User;
    })();
    Utils.User = User;
    var app = angular.module('app');
    app.controller(User.controllerId, ['$scope', '$rootScope', 'mapService', function ($scope, $rootScope, mapService) {
            return new User($scope, $rootScope, mapService);
        }]);
})(Utils || (Utils = {}));
//# sourceMappingURL=User.js.map
