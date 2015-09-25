(function() {
	widgetRegister.register("Process Insight", function(el, data, general, config) {

		var statusIndicatorIcons = {
			"ok": 'imgs/neutral_trading.svg',
			"bad": 'imgs/bearish.svg',
			'good': 'imgs/bullish.svg'
		};

		var statusColorTable = {
			'ok': 'black',
			'bad': '#e51c23',
			'good': '#31a354'
		};
		var statusBackgroundColorTable = {
			'ok': '#9E9B9B',
			'bad': '#d9534f',
			'good': '#31a354'
		};

		var statusOpacityBackgroundColorTable = {
			'ok': 'rgba(158, 155, 155, 0.06)',
			'bad': 'rgba(217, 83, 79, 0.09)',
			'good': 'rgba(49, 163, 84, 0.09)'
		};

		
		data.forEach(function(d, i) {
				var total = d.max - d.min;
				var epsilonStart = d.avg - 0.25 * total,
					epsilonEnd = d.avg + 0.25 * total;
				if (d.value > epsilonStart && d.value < epsilonEnd) {
					d.status = 'ok';
					return
				}

				if (d.value < epsilonStart) {
					d.status = 'good';
					return
				}

				if (d.value > epsilonEnd) {
					d.status = 'bad';
					return
				}
		});


		var tpl = uncomment(function() {/*
				
			<div class="panel panel-default">
				<div class="panel-heading process-header"><h4>Booking</h4>				
				</div>
				<div class="panel-body text-center">
					<img width="90%" />
					<img width="50%"  class="status-indicator"/>
					<h4 class="text text-center"></h4>

				</div>

		</div>*/});

	
	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

	function render () {
		var cols = d3.select(el)
		.append('div')
		.classed('row', true)
		.selectAll('.col-sm-4')

		.data(data);

		cols
		.enter()
		.append('div')
		.classed('col-sm-4', true)
		.html(tpl)

		cols.select('.panel-heading > h4')
			.text(function(d) {return d.name})	

		cols.select('.panel-heading')
			.style('color', 'white')
			.style('background-color', function(d) {
				return statusBackgroundColorTable[d.status];
			})

		cols.select('.panel-body')
			.style('background-color', function(d) {
				return statusOpacityBackgroundColorTable[d.status];
			})			


		cols.select('.panel-body img')
			.attr('src', function(d, i) {
				return d.link || 'imgs/' + d.name + '.svg';
			});

		cols.select('.panel-body img.status-indicator')
			.attr('src', function(d, i) {				
				return statusIndicatorIcons[d.status];
			})


		cols.select('.panel-body .text')
			.text(function(d) {
				return d.value + ' ' + d.measure;
			})
			.style('color', function(d, i) {
				return statusColorTable[d.status];
			})


		d3.select(window).on('scroll', animate);

		function animate() {
			var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0],
			    x = w.innerWidth || e.clientWidth || g.clientWidth,
			    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			   //  cols.each(function(d) {
			   //  	var rect = this.getBoundingClientRect();
			   //  	var height = parseInt(d3.select(this).style('width'), 10);

			   //  	if (rect.top + height < y) {
			   //  		var data = d3.select(this).datum();
			   //  		if (data.animated) return;
			   //  		data.animated = true;
			   //  		d3.select(this).datum(data);
			    		
			   //  		d3.select(this)
			   //  		.select('.panel-body svg path')
			   //  		.attr('fill', 'gray')
			   //  		.transition()
						// .duration(1000)
						// .attr('fill', function(d) {
						// 	return scale(d.value);
						// });
			   //  	}
			   //  });
		};
	}
	

	render();

		return {
			render: render
		};

	});
})()