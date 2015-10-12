trendChart = function(root) {
	var svg = d3.select(root).append('svg')
		.attr('class', 'trend'),
		_data = [],
		_width = 100,
		_height = 100;

	var line = svg.append('line')


	var _chart = {
		svg: function(){
			return svg;
		},
		data: function(data) {
			if (!arguments.length) return _data;

			_data = data;
			return _chart;
		},
		width: function(w) {
			if (!arguments.length) return _width;
			_width = w;
			return _chart;
		},
		height: function(_) {
			if (!arguments.length) return _height;
			_height = _;
			return _chart;
		},
		render: function() {

		},
		valueAccessor: function(d) {
			return d.value;
		},
		keyAccessor: function(d) {
			return d.key;
		},
		redraw: function() {
			var yScale = d3.scale.linear()
				.domain([0, d3.max(_data, _chart.valueAccessor)])
				.range([0, _height]),

				xScale = d3.scale.ordinal()
				.domain(d3.range(-1, 2))
				.rangeBands([0, _width]);
				// xScale = d3.scale.ordinal().domain();
			var bars = svg.selectAll('rect')
				.data(_data)

				bars.enter()
				.append('rect')

				.call(function(p) {
					p.append('title')
				});


				bars.attr('x', function(d, i) {
					return xScale(_chart.keyAccessor(d));
				})
				.attr('y', _height)
				.attr('width', xScale.rangeBand())
				.attr('height', 0)
				.attr('fill', function(d) {
					var key = _chart.keyAccessor(d);
					return  key == -1? 'rgb(44, 160, 44)':
							key == 1? 'red':
							'#ccc';
				})
				.select('title')
				.text( function(d) {return _chart.valueAccessor(d);})


				bars
				.transition()
				.duration(1000)
				.attr('y', function(d, i) {
					return _height - yScale(_chart.valueAccessor(d));
				})
				.attr('height', function(d) {
					return yScale(_chart.valueAccessor(d));
				})
				
			line.attr('x1', -10)
			.attr('x2', _width + 10)
			.attr('y1', _height)
			.attr('y2', _height)
			.attr('stroke', 'black')

			bars.exit().remove();
			return _chart;

		}
	}
		return _chart;

}