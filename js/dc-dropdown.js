dc.dropdown = function (parent, chartGroup) {
	var _chart = dc.baseMixin({});
	
	_chart._doRender = function () {
		if (!_chart.root().select('select').node())
				_chart.root().select('select').append('select');

		return _chart._doRedraw();
    };

    var _filter;
    _chart.filter = function(_) {
    	if (!arguments.length) {
    		return _filter;
    	}

    	_filter = _;

    	_chart.dimension().filter(_filter);
    	return _chart;
    }

    _chart._doRedraw = function () {
		var select = _chart.root().select('select');

        var data = [{ key: 'All', value: 0}].concat(_chart.group().all());

		var options = select.selectAll('option')
			.data(data);

			options.enter()
			.append('option')

			options.text(_chart.keyAccessor())

			options.exit().remove();

		select.node().value = _chart.filter() || 'All';

		select.on('change', function(d) {
			
			var filter = d3.event.target.value;
			if (filter == 'All') {
				 dc.events.trigger(function () {
				 	_chart.dimension().filterAll();
		            dc.redrawAll();
		        })
			} else {
				 dc.events.trigger(function () {
		            _chart.filter(filter);
				 	// _chart.dimension().filter(filter);
		            
		            // _chart.filters([filter]);
		            _chart.redrawGroup();
		            // dc.redrawAll();
		        });
			}

		});
		return _chart;
    };

    return _chart.anchor(parent, chartGroup);

};