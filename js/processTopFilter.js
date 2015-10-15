
processTopFilter = function(root) {
	var select = d3.select(root).append('select'),
		_data = [], _callback = function() {}, _allValue = 'All';

	var _chart = {
		data: function(d) {
			if (!arguments.length) return _data;
			_data = d;
			return _chart;
		},
		keyAccessor: function(d) {
			return d.key;
		},
		valueAccessor: function(d) {
			return d.value;
		},
		allValue: function(_) {
			_allValue = _;
			return _chart;
		},
		redraw: function() {
			
	        var data = [{ key: _allValue, value: 0}].concat(_data);
			var options = select.selectAll('option')
				.data(data);

				options.enter()
				.append('option')

				options.text(_chart.keyAccessor)

				options.exit().remove();

			// select.node().value = _chart.filter() || 'All';

			select.on('change', function(d) {
				var filter = d3.event.target.value;
				_chart.callback()(filter);


			});
			return _chart;
		},
		callback: function(_) {
			if (!arguments.length) return _callback;
			_callback = _;
			return _chart;
		}
	};

	return _chart;
}