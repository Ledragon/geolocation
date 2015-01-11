(function(){
    var app = angular.module('app', [    ]);

    app.controller('ctrl', ['$scope', function ($scope) {
        $scope.title = 'Hello, World!';
        try{
            var path = 'data/uk.json';
            var width = 800;
            var height = 600;
            var svg = d3.select('#mapContainer').append('svg')
            .attr('width', width)
            .attr('height', height);
            d3.json(path, function (error, uk) {
                if (error) {
                    console.error(error);
                    console.error(error.statusText);
                }
                else {
                    //console.log(uk);
                    var subunits = topojson.feature(uk, uk.objects.subunits);
                    var mercatorProjection = d3.geo.mercator()
                    .scale(500)
                    .translate([2 * width / 3, 2 / 3 * height]);

                    var albersProjection = d3.geo.albers()
                    .center([0, 55.4])
                    .rotate([4.4, 0])
                    .parallels([50, 60])
                    .scale(3000)
                    .translate([width / 2, height / 2]);


                    var path = d3.geo.path().projection(albersProjection);
                    svg.append('path')
                    .datum(subunits)
                    .attr('d', path);
                }
            });
        }
        catch(e){
            console.error(e);
        }
    }]);
})();