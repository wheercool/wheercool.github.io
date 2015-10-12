processDetail = function(root) {
	var svg = d3.select(root).append('svg')
		.attr('class', 'trend'),
		_data = [],
		_width = 100,
		_height = 100;

	var _chart = {
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
			var data = _data;
			// [{
			//     subject: 'Subject 1',
			//     value: 3.88
			// }, {
			//     subject: 'Subject 2',
			//     value: 2.5
			// }, {
			//     subject: 'Subject 3',
			//     value: 5
			// }, {
			//     subject: 'Subject 4',
			//     value: 17.75
			// }, {
			//     subject: 'Subject 5',
			//     value: 0.5
			// }, ];

			// Dimensions
			// var margin = {
			//     top: 20,
			//     right: 20,
			//     bottom: 20,
			//     left: 100
			// },
			// width = parseInt(d3.select('#chart').style('width'), 10),
			//     width = width - margin.left - margin.right,
			//     height = 500 - margin.top - margin.bottom,
			//     barHeight = 40,
			//     percent = d3.format('%');

			// Create the scale for the axis
			var xScale = d3.scale.linear()
			    .range([0, _width]); // the pixel range to map to

			var yScale = d3.scale.ordinal()
			    // SECOND PARAM IS PADDING
			    .rangeRoundBands([0, _height], 0.1);

			// Create the axis
			var xAxis = d3.svg.axis()
			    .scale(xScale)
			    .orient('bottom')
			   ;

			var yAxis = d3.svg.axis()
			    .scale(yScale)
			    .orient('left');

			xScale.domain([0, d3.max(_data, _chart.valueAccessor)]); // min/max extent of your data (this is usually dynamic e.g. max)
			yScale.domain(_data.map(_chart.keyAccessor));

			// Render the SVG
			// var svg = d3.select('#chart')
			//     .append('svg')
			//     .attr('height', height + margin.top + margin.bottom)
			//     .append('g') // Group the content and add margin
			// .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			// Render the axis
			svg.append('g')
			    .attr('class', 'x axis')
			    .attr('transform', 'translate(0,' + _height + ')')
			    .call(xAxis);

			svg.append("g")
			    .attr("class", "y axis")
			    .call(yAxis);

			// Render the bars
			svg.selectAll('.bar')
			    .data(data)
			    .enter()
			    .append('rect')
			    .attr('class', 'bar')
			    .attr('y', function (d) {
			    return yScale(d.subject);
			})
			    .attr('width', function (d) {
			    return xScale(d.value)
			})
			    // REPLACE barHeight WITH RANGE BAND
			    .attr('height', yScale.rangeBand);

					}
				}
		return _chart;

}