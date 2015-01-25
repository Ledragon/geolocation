var Utils;
(function (Utils) {
    var User = (function () {
        function User($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            $scope.vm = this;
            this.user = new Models.user('', '');
        }
        User.prototype.add = function () {
            if (this.user.name && this.user.country) {
                //var user = new Models.user(this.name, this.country);
                //user.latitude = this.latitude;
                //user.longitude = this.longitude;
                this.$rootScope.$broadcast('user-added', this.user);
            }
        };

        User.prototype.locate = function () {
            var self = this;
            var position = navigator.geolocation.getCurrentPosition(function (position) {
                self.user.latitude = position.coords.latitude;
                self.user.longitude = position.coords.longitude;
                self.$scope.$apply();
            }, function () {
            });
        };
        User.controllerId = 'User';
        return User;
    })();
    Utils.User = User;
    var app = angular.module('app');
    app.controller(User.controllerId, ['$scope', '$rootScope', function ($scope, $rootScope) {
            return new User($scope, $rootScope);
        }]);
})(Utils || (Utils = {}));
//# sourceMappingURL=User.js.map
