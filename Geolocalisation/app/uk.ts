var createUkMap = function (width, height, path) {
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
                .scale(100)
                .translate([2 * width / 3, 2 / 3 * height]);

            var albersProjection = d3.geo.albers()
                .center([0, 55.4])
                .rotate([4.4, 0])
                .parallels([50, 60])
                .scale(3000)
                .translate([width / 2, height / 2]);
            var path = d3.geo.path().projection(albersProjection);

            svg.selectAll('.subunit')

                .data(subunits.features)
                .enter()
                .append('path')
                .attr('class', function (d) { return 'subunit ' + d.id; })
                .attr('d', path);

            svg.append("path")
                .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) { return a !== b && a.id !== "IRL"; }))
                .attr("d", path)
                .attr("class", "subunit-boundary");

            svg.append("path")
                .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) { return a === b && a.id === "IRL"; }))
                .attr("d", path)
                .attr("class", "subunit-boundary IRL");

            svg.append("path")
                .datum(topojson.feature(uk, uk.objects.places))
                .attr("d", path)
                .attr("class", "place");

            svg.selectAll(".place-label")
                .data(topojson.feature(uk, uk.objects.places).features)
                .enter().append("text")
                .attr("class", "place-label")
                .attr("transform", function (d) { return "translate(" + albersProjection(d.geometry.coordinates) + ")"; })
                .attr("dy", ".35em")
                .text(function (d) { return d.properties.name; });

            svg.selectAll(".place-label")
                .attr("x", function (d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
                .style("text-anchor", function (d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });
        }
    });
} 