var Controllers;
(function (Controllers) {
    var zoomController = (function () {
        function zoomController() {
            this.greeting = 'hello from controller';
        }
        return zoomController;
    })();
    Controllers.zoomController = zoomController;
    var app = angular.module('app');
    app.controller('zoomController', [function () { return new zoomController(); }]);
})(Controllers || (Controllers = {}));
//# sourceMappingURL=zoomController.js.map