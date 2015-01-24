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

    }
    export class Sovereignties implements ISovereignties {

        private _data;
        isLoading: boolean;
        countries: Array<any>;
        selectedCountry: string;
        cX: number;
        cY: number;
        translateX = 0;
        translateY = 0;
        scale = 1;

        mapGroup: D3.Selection;

        constructor(private $scope: ISovereigntiesScope) {
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            var self = this;
            self.selectedCountry = '';

            d3.json('data/sovereignty.topo.json', (error, data) => {
                if (!error) {
                    var sovereignty = topojson.feature(data, data.objects.sovereignty);
                    self._data = sovereignty;
                    //var test = _.where(sovereignty.features, (s) => {
                    //    return s.properties.name === 'Belgium';
                    //});
                    //self._data.features = test;
                    var geom = data.objects.sovereignty.geometries;
                    var properties = _.pluck(self._data.features, 'properties');
                    properties.forEach((p) => {
                        self.countries.push(p.name);
                    })
                    self.drawmap('sovereignties');
                    self.isLoading = false;
                    self.$scope.$apply();

                }
            })
        }

        private drawmap(containerName: string) {
            var width = $('#' + containerName).width();
            var height = 800;
            var svg = d3.select('#' + containerName)
                .append('svg')
                .attr({
                    'width': width,
                    'height': height
                });
            this.mapGroup = svg.append('g');

            var mercatorProjection = d3.geo.mercator()
                .translate([width / 2, height / 2])
                .scale(120)
                .center([5, 50]);
            var self = this;
            var path = d3.geo.path()
                .projection(mercatorProjection);

            var enter = this.mapGroup.selectAll('.sovereignty')
                .data(this._data.features)
                .enter();
            var g = enter.append('g').classed('country', true);
            var self = this;
            g.append('path')
                .attr('d', path)
                .on('click', (d) => {
                    var position = [d3.event.clientX, d3.event.clientY];
                    var tmp = mercatorProjection.invert(position);
                    self.selectedCountry = d.properties.name;
                    var name = self.mapGroup.select('text');
                    var c = path.centroid(d);
                    var bounds = path.bounds(d);
                    //console.log('bound:' + bounds);
                    //console.log('centroid:'+c);
                    self.translateX = -bounds[0][0];
                    self.translateY = -bounds[0][1];

                    self.scale = Math.min(width / (bounds[1][0] - bounds[0][0]), height / (bounds[1][1] - bounds[0][1]));
                    self.update();
                    //name.attr("transform", "translate(" + c + ")")
                    //    .text(d.properties.name);
                    //self.cX = c[0];
                    //self.cY = c[1];
                    //if (c[0] > width / 2) {
                    //    self.translateX = width / 2 - c[0];
                    //}
                    //else {
                    //    self.translateX = c[0];
                    //}
                    //if (c[1] > height / 2) {
                    //    self.translateY = height / 2 - c[1];
                    //}
                    //else {
                    //    self.translateY = c[1];
                    //}
                    ////self.scale = 2;
                    //self.update();
                    self.$scope.$apply();
                })
                .on('mouseover', (d) => {
                    var s = d3.select(d3.event.currentTarget);
                    s.style('fill', 'blue');
                    self.selectedCountry = d.properties.name;
                    self.$scope.$apply();
                })
                .on('mouseout', (d) => {
                    var s = d3.select(d3.event.currentTarget);
                    s.style('fill', '#ccc');
                })
                .style({
                    fill: (d) => {
                        // Asia,Africa,Europe,South America,Antarctica,North America,Oceania,Seven seas (open ocean)
                        var color = '#ccc';
                        //if (d.properties.continent === 'Europe') {
                        //    color = 'blue';
                        //} else if (d.properties.continent === 'Asia') {
                        //    color = 'yellow';
                        //} else if (d.properties.continent === 'Oceania') {
                        //    color = 'Green';
                        //}
                        return color;
                    }
                });
            var name = this.mapGroup.append('text');
            this.update();

        }

        zoom(self: Sovereignties) {
            return () => {
                var translate = d3.event.translate;
                self.scale = d3.event.scale;
                self.mapGroup
                //.transition()
                    .attr({
                        'transform': 'scale(' + self.scale + ')' + 'translate(' + self.translateX + ',' + self.translateY + ')'
                    });
            }
        }

        update() {
            this.mapGroup
                .transition()
                .attr({
                    'transform-origin': '50%' + ' ' + '50%',
                    'transform': 'scale(' + this.scale + ')translate(' + this.translateX + ',' + this.translateY + ')'

                });
        }

        locate() {
            var position = navigator.geolocation.getCurrentPosition((position) => {
                //    var projection = mercatorProjection([position.coords.longitude, position.coords.latitude]);
                //    self.mapGroup.append('circle').attr({
                //        'cx': projection[0],
                //        'cy': projection[1],
                //        'r': 2
                //    });//.text('my position');
            }, () => { });

        }

        reset() {
            this.scale = 1;
            this.translateX = 0;
            this.translateY = 0;
            this.update();
        }
    }

    var app = angular.module('app');
    app.controller('Sovereignties', ['$scope', ($scope) => new Sovereignties($scope)]);
}