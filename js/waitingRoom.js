(function() {
	widgetRegister.register("Waiting Room", function(el, data, general, config) {

	var tpl = uncomment(function(){/*
<div class="row waiting-room">
			<div class="col-md-12 clock text-center">								
				<span>12:34</span>
			</div>
				
			
		</div>

		<div class="row">
			<div class="col-md-4">
				<div class="panel panel-default ct-speedo" >
					<div class="panel-heading ">CT</div>
					<div class="panel-body">
						<!-- svg  xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%"><defs></defs>
							<circle cx="125" cy="100" r="100" opacity="1" fill="gray"></circle>
							<circle cx="125" cy="100" r="40" fill="white"></circle>


							<path fill="none" d="M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887" stroke="#FAD60A" stroke-width="10px" stroke-linecap="butt"></path>

							<path fill="none" d="M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999" stroke="red" stroke-width="10px" stroke-linecap="butt"></path>

							<path fill="none" d="M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916" stroke="#31a354" stroke-width="18px" stroke-linecap="round"></path>

							
							
							<g class="arrow-indicator" transform="rotate(110 125 100)" fill="black">
								
								<circle cx="125" cy="100" r="10" ></circle>

								<rect fill="red" x="42" y="100" width="80" height="2" stroke-width="0.000001" ></rect>

								
								
							</g>
						</svg -->
						<img src="imgs/speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>				
				
			</div>
			<div class="col-md-4">
				<div class="panel panel-default">
					<div class="panel-heading ">Buddy</div>
					<div class="panel-body">
						<img src="imgs/speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>	
			</div>
			<div class="col-md-4">
				<div class="panel panel-default">
					<div class="panel-heading ">MR</div>
					<div class="panel-body">
						<img src="imgs/speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>	
			</div>
		</div>
*/
	})

		d3.select(el)
			.html(tpl);

		scale = d3.scale.linear().domain([-60 * 4, 0,  60 * 4]) //4 hours
									.range([0, 90, 180]);

		var value = 5;


		var svg = d3.select('.ct-speed svg')


		d3.select('.ct-speedo .arrow-indicator')
			.transition()
			.duration(2000)
			 .attrTween("transform", tween);
			// .attr('transform', 'rotate(' + scale(value) + ' 120 100)')

			 function tween(d, i, a) {
			 	console.log(i);
		      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(value) + ", 125 100)");
		    }

		d3.select('.ct-speedo h4')
			.text(function(d) {
				return '' + value + ' min';
			})

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