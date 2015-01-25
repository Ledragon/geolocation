var Utils;
(function (Utils) {
    var Sovereignties = (function () {
        function Sovereignties($scope) {
            this.$scope = $scope;
            this.translateX = 0;
            this.translateY = 0;
            this.scale = 1;
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            this.selectedCountry = '';
            this.init('sovereignties');
            this.userList = [];

            var self = this;
            $scope.$on('user-added', function (data, arg) {
                self.userList.push(arg);
                var projected = self._mercatorProjection([arg.longitude, arg.latitude]);
                var country = _.find(self._data.features, function (d, i) {
                    var bounds = self._path.bounds(d);
                    var result = bounds[0][0] <= projected[0] && bounds[1][0] >= projected[0] && bounds[0][1] <= projected[1] && bounds[1][1] >= projected[1];
                    return result;
                });
                if (country) {
                    console.log(country);
                }
                self.mapGroup.append('circle').attr({
                    'cx': projected[0],
                    'cy': projected[1],
                    'r': 2 / self.scale
                });
            });
            this.loadMap();
            //this.isLoading = false;
        }
        Sovereignties.prototype.loadMap = function () {
            var self = this;
            d3.json('data/sovereignty.topo.json', function (error, data) {
                if (!error) {
                    var sovereignty = topojson.feature(data, data.objects.sovereignty);
                    self._data = sovereignty;

                    //var test = _.where(sovereignty.features, (s) => {
                    //    return s.properties.name === 'Belgium';
                    //});
                    //self._data.features = test;
                    var geom = data.objects.sovereignty.geometries;
                    var properties = _.pluck(self._data.features, 'properties');
                    properties.forEach(function (p) {
                        self.countries.push(p.name);
                    });
                    self.drawmap('sovereignties');
                    self.isLoading = false;
                    self.$scope.$apply();
                }
            });
        };

        Sovereignties.prototype.init = function (containerName) {
            this._width = $('#' + containerName).width();
            this._height = 400;
            var svg = d3.select('#' + containerName).append('svg').attr({
                'width': this._width,
                'height': this._height
            });
            this.mapGroup = svg.append('g');

            this._mercatorProjection = d3.geo.mercator().translate([this._width / 2, this._height / 2]).scale(120).center([5, 50]);
            this._path = d3.geo.path().projection(this._mercatorProjection);
        };

        Sovereignties.prototype.drawmap = function (containerName) {
            var _this = this;
            var enter = this.mapGroup.selectAll('.sovereignty').data(this._data.features).enter();
            var g = enter.append('g').classed('country', true);
            var self = this;
            g.append('path').attr('d', this._path).on('click', function (d) {
                _this.clickCountry(d);
            }).on('mouseover', function (d) {
                var s = d3.select(d3.event.currentTarget);
                s.style('fill', 'blue');
                self.selectedCountry = d.properties.name;
                self.$scope.$apply();
            }).on('mouseout', function (d) {
                var s = d3.select(d3.event.currentTarget);
                s.style('fill', '#ccc');
            }).style({
                fill: '#ccc'
            });
            this.update();
        };

        Sovereignties.prototype.clickCountry = function (d) {
            var bounds = this._path.bounds(d);
            this.translateX = -bounds[0][0];
            this.translateY = -bounds[0][1];
            this.scale = Math.min(this._width / (bounds[1][0] - bounds[0][0]), this._height / (bounds[1][1] - bounds[0][1]));
            this.update();
            this.$scope.$apply();
        };

        Sovereignties.prototype.zoom = function (self) {
            return function () {
                var translate = d3.event.translate;
                self.scale = d3.event.scale;
                self.mapGroup.attr({
                    'transform': 'scale(' + self.scale + ')' + 'translate(' + self.translateX + ',' + self.translateY + ')'
                });
            };
        };

        Sovereignties.prototype.update = function () {
            this.mapGroup.transition().attr({
                'transform-origin': '50%' + ' ' + '50%',
                'transform': 'scale(' + this.scale + ')translate(' + this.translateX + ',' + this.translateY + ')'
            });
            this.mapGroup.select('circle').attr({ 'r': (2 / this.scale) });
        };

        Sovereignties.prototype.locate = function () {
            var self = this;
            var position = navigator.geolocation.getCurrentPosition(function (position) {
                var projection = self._mercatorProjection([position.coords.longitude, position.coords.latitude]);
                self.mapGroup.append('circle').attr({
                    'cx': projection[0],
                    'cy': projection[1],
                    'r': 2 / self.scale
                }); //.text('my position');
            }, function () {
            });
        };

        Sovereignties.prototype.reset = function () {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.update();
        };
        return Sovereignties;
    })();
    Utils.Sovereignties = Sovereignties;

    var app = angular.module('app');
    app.controller('Sovereignties', ['$scope', function ($scope) {
            return new Sovereignties($scope);
        }]);
})(Utils || (Utils = {}));
//# sourceMappingURL=Sovereignties.js.map
