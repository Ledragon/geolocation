var Services;
(function (Services) {
    var mapService = (function () {
        function mapService() {
            this.loadMap();
        }
        mapService.prototype.loadMap = function () {
            var self = this;
            d3.json('data/sovereignty.topo.json', function (error, data) {
                if (!error) {
                    var sovereignty = topojson.feature(data, data.objects.sovereignty);
                    self._data = sovereignty;
                }
            });
        };

        mapService.prototype.init = function (containerName) {
            this._width = $('#' + containerName).width();
            this._height = 400;
            var svg = d3.select('#' + containerName).append('svg').attr({
                'width': this._width,
                'height': this._height
            });
            this._mapGroup = svg.append('g');

            this._mercatorProjection = d3.geo.mercator().translate([this._width / 2, this._height / 2]).scale(120).center([5, 50]);
            this._path = d3.geo.path().projection(this._mercatorProjection);
            this.drawmap();
        };

        mapService.prototype.drawmap = function () {
            var enter = this._mapGroup.selectAll('.sovereignty').data(this._data.features).enter();
            var g = enter.append('g').classed('country', true);
            var self = this;
            g.append('path').attr('d', this._path).on('click', function (d) {
                //this.clickCountry(d);
            }).on('mouseover', function (d) {
                var s = d3.select(d3.event.currentTarget);
                s.style('fill', 'blue');
                //self.selectedCountry = d.properties.name;
                //self.$scope.$apply();
            }).on('mouseout', function (d) {
                var s = d3.select(d3.event.currentTarget);
                s.style('fill', '#ccc');
            }).style({
                fill: '#ccc'
            });
            //this.update();
        };

        mapService.prototype.getCountry = function (longitude, latitude) {
            var _this = this;
            var self = this;
            var projected = this._mercatorProjection([longitude, latitude]);
            var country = _.find(self._data.features, function (d, i) {
                var bounds = _this._path.bounds(d);
                var result = bounds[0][0] <= projected[0] && bounds[1][0] >= projected[0] && bounds[0][1] <= projected[1] && bounds[1][1] >= projected[1];
                return result;
            });
            if (country) {
                console.log(country);
            }
            return country;
        };
        mapService.serviceId = 'mapService';
        return mapService;
    })();

    var app = angular.module('app');
    app.factory(mapService.serviceId, [function () {
            return new mapService();
        }]);
})(Services || (Services = {}));
//# sourceMappingURL=mapService.js.map
