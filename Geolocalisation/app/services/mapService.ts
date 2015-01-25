module Services {
    export interface IMapService {
        getCountry(latitude, longitude);
    }

    class mapService {
        static serviceId = 'mapService';

        private _mercatorProjection: D3.Geo.Projection;
        private _path: D3.Geo.Path;
        private _width: number;
        private _height: number;
        private _mapGroup: D3.Selection;
        private _data;

        constructor() {
            this.loadMap();

        }

        private loadMap() {
            var self = this;
            d3.json('data/sovereignty.topo.json', (error, data) => {
                if (!error) {
                    var sovereignty = topojson.feature(data, data.objects.sovereignty);
                    self._data = sovereignty;
                }
            })
        }

        init(containerName: string) {
            this._width = $('#' + containerName).width();
            this._height = 400;
            var svg = d3.select('#' + containerName)
                .append('svg')
                .attr({
                    'width': this._width,
                    'height': this._height
                });
            this._mapGroup = svg.append('g');

            this._mercatorProjection = d3.geo.mercator()
                .translate([this._width / 2, this._height / 2])
                .scale(120)
                .center([5, 50]);
            this._path = d3.geo.path()
                .projection(this._mercatorProjection);
            this.drawmap();

        }

        private drawmap() {
            var enter = this._mapGroup
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
                    //this.clickCountry(d);
                })
                .on('mouseover', (d) => {
                    var s = d3.select(d3.event.currentTarget);
                    s.style('fill', 'blue');
                    //self.selectedCountry = d.properties.name;
                    //self.$scope.$apply();
                })
                .on('mouseout', (d) => {
                    var s = d3.select(d3.event.currentTarget);
                    s.style('fill', '#ccc');
                })
                .style({
                    fill: '#ccc'
                });
            //this.update();
        }

        getCountry(longitude, latitude) {
            var self = this;
            var projected = this._mercatorProjection([longitude, latitude]);
            var country = _.find(self._data.features, (d, i) => {
                var bounds = this._path.bounds(d);
                var result = bounds[0][0] <= projected[0] && bounds[1][0] >= projected[0]
                    && bounds[0][1] <= projected[1] && bounds[1][1] >= projected[1];
                return result;
            });
            if (country) {
                console.log(country);
            }
            return country;
        }
    }

    var app = angular.module('app');
    app.factory(mapService.serviceId, [() => new mapService()]);
} 