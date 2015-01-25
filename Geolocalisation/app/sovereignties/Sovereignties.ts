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

        userList: Array<Models.user>;

        private _mercatorProjection: D3.Geo.Projection;
        private _path: D3.Geo.Path;
        private _width: number;
        private _height: number;

        constructor(private $scope: ISovereigntiesScope) {
            $scope.vm = this;
            this.isLoading = true;
            this.countries = [];
            this.selectedCountry = '';
            this.init('sovereignties');
            this.userList = [];


            var self = this;
            $scope.$on('user-added', (data, arg: Models.user) => {
                self.userList.push(arg);
                    var projected = self._mercatorProjection([arg.longitude, arg.latitude]);
                var country = _.find(self._data.features, (d, i) => {
                    var bounds = self._path.bounds(d);
                    var result = bounds[0][0] <= projected[0] && bounds[1][0] >= projected[0]
                        && bounds[0][1] <= projected[1] && bounds[1][1] >= projected[1];
                    return result;
                });
                if(country){
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

        private loadMap() {
            var self = this;
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

        private init(containerName:string) {
            this._width = $('#' + containerName).width();
            this._height = 400;
            var svg = d3.select('#' + containerName)
                .append('svg')
                .attr({
                    'width': this._width,
                    'height': this._height
                });
            this.mapGroup = svg.append('g');

            this._mercatorProjection = d3.geo.mercator()
                .translate([this._width / 2, this._height / 2])
                .scale(120)
                .center([5, 50]);
            this._path = d3.geo.path()
                .projection(this._mercatorProjection);

        }

        private drawmap(containerName: string) {
            var enter = this.mapGroup
                .selectAll('.sovereignty')
                .data(this._data.features)
                .enter();
            var g = enter
                .append('g')
                .classed('country', true);
            var self = this;
            g.append('path')
                .attr('d', this._path)
                .on('click', (d) => {
                    this.clickCountry(d);
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
                    fill: '#ccc'
                });
            this.update();
        }

        clickCountry(d) {
            var bounds = this._path.bounds(d);
            this.translateX = -bounds[0][0];
            this.translateY = -bounds[0][1];
            this.scale = Math.min(this._width / (bounds[1][0] - bounds[0][0]), this._height / (bounds[1][1] - bounds[0][1]));
            this.update();
            this.$scope.$apply();
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
            this.mapGroup.select('circle').attr({ 'r': (2 / this.scale) });

        }

        locate() {
            var self = this;
            var position = navigator.geolocation.getCurrentPosition((position) => {
                    var projection =self._mercatorProjection([position.coords.longitude, position.coords.latitude]);
                self.mapGroup.append('circle').attr({
                    'cx': projection[0],
                    'cy': projection[1],
                    'r': 2 / self.scale
                    });//.text('my position');
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