var Utils;
(function (Utils) {
    var Sovereignties = (function () {
        function Sovereignties($scope) {
            this.$scope = $scope;
            this.translateX = 350;
            this.translateY = 350;
            this.scale = 120;
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            var self = this;
            d3.json('data/sovereignty.topo.json', function (error, data) {
                if (!error) {
                    var sovereignty = topojson.feature(data, data.objects.sovereignty);
                    self._data = sovereignty;

                    //var test = _.where(sovereignty.features, (s) => {
                    //    return s.properties.continent[0].toLowerCase() === 'e';
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
        }
        Sovereignties.prototype.drawmap = function (containerName) {
            var width = $('#' + containerName).width();
            var height = 600;
            var svg = d3.select('#' + containerName).append('svg').attr({
                'width': width,
                'height': height
            });
            this.mapGroup = svg.append('g');

            var mercatorProjection = d3.geo.mercator().scale(1).translate([0, 0]);

            var path = d3.geo.path().projection(mercatorProjection);

            var enter = this.mapGroup.selectAll('.sovereignty').data(this._data.features).enter();
            var g = enter.append('g').classed('country', true);
            var self = this;
            g.append('path').attr('d', path).style({
                fill: function (d) {
                    // Asia,Africa,Europe,South America,Antarctica,North America,Oceania,Seven seas (open ocean)
                    var color = '#ccc';
                    if (d.properties.continent === 'Europe') {
                        color = 'blue';
                    } else if (d.properties.continent === 'Asia') {
                        color = 'yellow';
                    } else if (d.properties.continent === 'Oceania') {
                        color = 'Green';
                    }
                    return color;
                }
            });

            //g.append('text')
            //    .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            //    .style({
            //        'text-anchor':'middle'
            //    })
            //    .text(d=> { return d.properties.name;});
            //var continents = _.pluck(this._data.features, 'properties');
            //continents = _.uniq(continents, 'continent');
            //continents = _.pluck(continents, 'continent');
            //console.log(continents);
            //svg.selectAll('.country-label')
            //    .data(this._data.features)
            //    .enter()
            //    .append('text')
            //    .attr({
            //        'dy': '.35em',
            //        'transform': (d) => { return 'translate(' + mercatorProjection(d.geometry.coordinates) + ')'; }
            //    })
            //    .text((d) => { return d.properties.name; })
            this.update();
        };

        Sovereignties.prototype.update = function () {
            this.mapGroup.transition().attr({
                'transform': 'translate(' + this.translateX + ',' + this.translateY + ')' + 'scale(' + this.scale + ')'
            });
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
