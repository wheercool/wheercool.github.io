dc.speedo = function (parent, chartGroup) {
	var _chart = dc.baseMixin({});

	_chart._doRender = function () {
        //_chart.selectAll('tbody').remove();
        _chart.resetSvg();
        var g = _chart.svg()
        	.attr('viewBox', '35 10 180 100')
			.attr('preserveAspectRatio', 'xMidYMid meet')
        	.append('g')

        //renderRows(renderGroups());
        g.append('path')
				.attr('stroke', "#31a354")
				.attr('fill', 'none')
				.attr('d', "M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916")
				.attr('stroke-width', 15)
				
			g.append('path')
				.attr('stroke', "#ccc")
				.attr('fill', 'none')
				.attr('d', "M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887")
				.attr('stroke-width', 15)

			g.append('path')
				.attr('stroke', "red")
				.attr('fill', 'none')
				.attr('d', "M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999")
				.attr('stroke-width', 15)

			var indicator = g.append('g')
							.attr('class', 'indicator')

				indicator.append('circle')
				.attr('cx', 45)
				.attr('cy', 100)
				.attr('r', 8);

				var data = _chart.group().all()[0].value,
						min = data.min,
						max = data.max,
						value = data.sum;
						debugger;
			indicator.transition()
				.duration(3000)
				.attrTween('transform', function tween(d, i, a) {
					
				scale = d3.scale.linear().domain([min, max]) 
									.range([0, 180])
		      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(value) + ", 125 100)");
		    })	

        return _chart;
    };

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);

};