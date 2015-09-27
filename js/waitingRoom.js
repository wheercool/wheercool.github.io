(function() {
	widgetRegister.register("Waiting Room", function(el, data, general, config) {

	var containerTpl = uncomment(function (){/*
		<div class="waiting-room">
			<div class="col-md-12 clock text-center">	

				<span>--:--</span>
			</div>	

			<div class="row speedos">
			</div>				
		</div>
		*/
	});
	
	var ringTpl = uncomment(function(){
		/*
			<path stroke="#31a354" fill="none" d="M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916"  stroke-width="10px" stroke-linecap="butt"></path>
			<path fill="none" stroke="#ccc"  stroke-width="10px" d="M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887"></path>
			<path fill="none" d="M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999" stroke="red" stroke-width="10px" stroke-linecap="butt"></path>
			

		*/
	})

	var indicatorTpl = uncomment(function(){
		/*
				<path d="M 138 98 L40 100 138 102"></path>								
				<circle cx="125" cy="100" r="6" stroke="black"  fill="#ccc"></circle>

		*/
	})


		d3.select(el)
			.html(containerTpl);


		scale = d3.scale.linear().domain([config.min || -30, 0,  config.max || 30]) 
									.range([0, 90, 180])
									.clamp(true)
	

		var panel = d3.select(el).select('.speedos')
			.selectAll('.col-md-4')
			.data(data)
			.enter()
			.append('div')
			.classed('col-md-4', true)
			.append('div')
			.attr('class', 'panel panel-default')

		var header = panel.append('div')
			.attr('class', 'panel-heading text-center bold')
			.append('h4')
			.text(function(d) {return d.room})

		var body = panel.append('div')
			.attr('class', 'panel-body text-center')
			// .style('background-color', function(d) {
			// 	return d.time > config.max? 'rgba(217, 83, 79, 0.0901961)': 'white';
			// })

		var svg = body.append('svg')
					// .attr('preserveAspectRatio', 'xMinYMin meet')
					.attr('viewBox', '0 0 255 125')

		var colors = config.sectorColors || {
			"ok": "#ccc",
			"good": "#31a354",
			"bad":  "red"
		};
			svg.append('path')
				.attr('stroke', colors.good)
				.attr('d', "M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916")
				.attr('stroke-width', '10px')
				.attr('fill', 'none')

			svg.append('path')
				.attr('stroke', colors.ok)
				.attr('d', "M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887")
				.attr('stroke-width', '10px')
				.attr('fill', 'none')

			svg.append('path')
				.attr('stroke', colors.bad)
				.attr('d', "M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999")
				.attr('stroke-width', '10px')
				.attr('fill', 'none')

			// svg.html(ringTpl)

		var indicators = svg.append('g')
			.classed('arrow-indicator', true)

			indicators.append('path')
				.attr('d', 'M 138 98 L40 100 138 102')

			indicators.append('circle')
				.attr('cx', 125)
				.attr('cy', 100)
				.attr('r', 6)
				.attr('stroke', 'black')
				.attr('fill', '#ccc')
				
		body.append('h4')		
			.text(function(d) {
				if (d.time == 0) return 'in time';
				return  (d.time > 0 ?'+': '') + d.time + ' min';
			})


		indicators
		.transition()
		.duration(2000)
		 .attrTween("transform", tween);
	
		 function tween(d, i, a) {
	      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(d.time) + ", 125 100)");
	    }

	});

	requestAnimationFrame(animateFunc);



	function animateFunc(t) {
		requestAnimationFrame(animateFunc);
		//DO animation here ...
		d3.select('.clock .seconds')
			.classed('invisible', Math.floor(t / 500) % 2)
		// console.log(t);
	}
	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

	setInterval(function() {
		d3.select('.clock span')
			.html(d3.time.format('%H<span class="seconds">:</span>%M')(new Date()))
			// .html(d3.time.format('%H:%M')(new Date()))
	}, 500)
})()