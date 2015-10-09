(function() {
	widgetRegister.register("Process Insight", function(el, data, general, config) {

		var statusIndicatorIcons = config.stepIndicatorIcons || {
			"ok": "imgs/neutral_trading.svg",
			"bad": "imgs/bearish.svg",
			"good": "imgs/bullish.svg"
		};

		var statusColorTable = config.stepTextColor  || {
			"ok": "black",
			"bad": "#e51c23",
			"good": "#31a354"
		};
		var statusBackgroundColorTable = config.stepHeaderBackgroundColor || {
			"ok": "#9E9B9B",
			"bad": "#d9534f",
			"good": "#31a354"
		};

		var statusOpacityBackgroundColorTable = config.stepBackgroundColor || {
			"ok": "rgba(158, 155, 155, 0.06)",
			"bad": "rgba(217, 83, 79, 0.09)",
			"good": "rgba(49, 163, 84, 0.09)"
		};

		
		// scale = d3.scale.linear().domain([config.min || -30, 0,  config.max || 30]) 
		// 							.range([0, 90, 180])
		// 							.clamp(true)

		data.forEach(function(d, i) {
				var scale = d3.scale.linear().domain([d.min, d.max]).range([0, 180]);
				var angle = scale(d.duration)
				if (angle <= 60) {
					d.status = 'good';
					return
				}

				if (angle >= 120) {
					d.status = 'bad';
					return
				}

				d.status = 'ok';
				
		});


		var tpl = uncomment(function() {/*
				<div class="front">	
					<div class="panel panel-default">
							<div class="panel-heading process-header">
								<h4>Booking</h4>				
							</div>
							<div class="panel-body text-center">
								<img width="60%" />
								<svg width="80%"  class="status-indicator"/>
								<h4 class="text text-center"></h4>

							</div>

					</div>
				</div>

				<div class="back" style="display:none">
					<div class="panel panel-default">
						<div class="panel-heading process-header">
							<h4>Booking</h4>				
						</div>
						<div class="panel-body text-center">
							<table class="table table-condensed table-striped">
								<thead>
									<tr>
										<th>Measure</th>
										<th>Value</th>
									</tr>
								</thead>
								<tr>
									<td>Duration</td>
									<td>9</td>
								</tr>
								<tr>
									<td>Min</td>
									<td>0</td>
								</tr>
								<tr>
									<td>Max</td>
									<td>10</td>
								</tr>
								<tr>
									<td>AVG</td>
									<td>10</td>
								</tr>
								
							</table>
						</div>
					</div>
				</div>
	*/});

	
	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

	function render () {
		d3.select(el).html(''); //clear
		var cols = d3.select(el)
		.append('div')
		.classed('row', true)
		.selectAll('.col-sm-2')

		.data(data);

		cols
		.enter()
		.append('div')
		.attr('class', 'col-sm-2 flipper')
		// .on('click', function() {

		// 	// var f = d3.select(this)
		// 	// 	.select('.front');


		// 		// var img = f.select('img')

		// 		// 	img
		// 		// 	.attr('height', img.style('height'))

		// 		// f.style('width', f.style('width'))
		// 		// // .style('height', f.style('height'))
		// 		// .transition()
		// 		// .duration(1000)
		// 		// .style('width', "0px")
		// 		// .style('height', f.style('height'))


		// })
		.attr('onclick', "this.classList.toggle('flipped')")
		.html(tpl)


			function whichTransitionEvent(){
			    var t;
			    var el = document.createElement('fakeelement');
			    var transitions = {
			      'transition':'transitionend',
			      'OTransition':'oTransitionEnd',
			      'MozTransition':'transitionend',
			      'WebkitTransition':'webkitTransitionEnd'
			    }

			    for(t in transitions){
			        if( el.style[t] !== undefined ){
			            return transitions[t];
			        }
			    }
			}

			/* Listen for a transition! */
			var transitionEvent = whichTransitionEvent();
			transitionEvent && el.addEventListener(transitionEvent, function(e) {
				var b = d3.select(e.target)
					.classed('flipped');
				if (b) {
					d3.select(e.target)
						.select('.front')
						.style('display', 'none');

					d3.select(e.target)
						.select('.back')
						.style('display', 'block');

				} else {
					d3.select(e.target)
						.select('.back')
						.style('display', 'none');

					d3.select(e.target)
						.select('.front')
						.style('display', 'block');
				}
				console.log('Transition complete!  This is the callback, no library needed!');
			});


		cols.select('.panel-heading > h4')
			.text(function(d) {return d.step})	

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
				return d.link || 'imgs/' + d.step + '.svg';
			});

		var indicator = cols.select('.panel-body .status-indicator')
			.attr('viewBox', '35 10 180 100')
			.attr('preserveAspectRatio', 'xMidYMid meet')

			indicator.append('path')
				.attr('stroke', "#31a354")
				.attr('fill', 'none')
				.attr('d', "M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916")
				.attr('stroke-width', 15)
				
			indicator.append('path')
				.attr('stroke', "#ccc")
				.attr('fill', 'none')
				.attr('d', "M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887")
				.attr('stroke-width', 15)

			indicator.append('path')
				.attr('stroke', "red")
				.attr('fill', 'none')
				.attr('d', "M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999")
				.attr('stroke-width', 15)

			var g = indicator.append('g')
				// .attr('transform', 'rotate(10, 125 100)')
		// 		.attr('transform', function(d) {
						
		// // 							.clamp(true)
		// 			console.log(d.status)
		// 			console.log(scale(d.duration))
		// 			return 'rotate(' +  scale(d.duration) + ', 125 100)';
		// 		})

				g.append('circle')
				.attr('cx', 45)
				.attr('cy', 100)
				.attr('r', 8);


			g.transition()
				.duration(3000)
				.attrTween('transform', function tween(d, i, a) {
				scale = d3.scale.linear().domain([d.min, d.max]) 
									.range([0, 180])
		      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(d.duration) + ", 125 100)");
		    })

			// .attr('src', function(d, i) {				
			// 	return statusIndicatorIcons[d.status];
			// })


		cols.select('.panel-body .text')
			.text(function(d) {
				return d.duration + ' ' + d.measure;
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
						// 	return scale(d.duration);
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