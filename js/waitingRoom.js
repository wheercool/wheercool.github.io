(function() {
	widgetRegister.register("Waiting Room", function(el, data, general, config) {

	var containerTpl = uncomment(function (){/*
		<div class="row waiting-room">
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
							<circle cx="125" cy="100" r="5" transform="rotate(30.036490127433755 125 100)" fill="#F0F0F0"></circle>

		*/
	})


	var indicatorTpl = uncomment(function(){
		/*
				<path fill="#585858" d="M 135 100 A 10 10 0 1 1 134.999999999995 99.99999 L 131.9999999999965 99.999993 A 7 7 0 1 0 132 100 Z"></path>

				<rect fill="#585858" x="42" y="100" width="74" height="2" stroke-width="0.000001"></rect>

				<rect fill="#585858" x="135" y="97" width="6" height="6" stroke-width="0.000001" ></rect>
					

		*/
	})


		d3.select(el)
			.html(containerTpl);


		scale = d3.scale.linear().domain([config.min, 0,  config.max]) 
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
			.attr('class', 'panel-heading')
			.text(function(d) {return d.name})

		var body = panel.append('div')
			.attr('class', 'panel-body text-center')
			// .style('background-color', function(d) {
			// 	return d.value > config.max? 'rgba(217, 83, 79, 0.0901961)': 'white';
			// })

		var svg = body.append('svg')
					.attr('preserveAspectRatio', 'xMinYMin meet')
					.attr('viewBox', '0 0 255 125')

			svg.html(ringTpl)

		var indicators = svg.append('g')
			.classed('arrow-indicator', true)

			indicators.html(indicatorTpl)

		body.append('h4')		
			.text(function(d) {
				if (d.value == 0) return 'in time';
				return  (d.value > 0 ?'+': '') + d.value + ' min';
			})


		indicators
		.transition()
		.duration(2000)
		 .attrTween("transform", tween);
	
		 function tween(d, i, a) {
	      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(d.value) + ", 125 100)");
	    }


	});


	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

	setInterval(function() {
		d3.select('.clock span')
			.html(d3.time.format('%H:%M')(new Date()))
	}, 500)
})()