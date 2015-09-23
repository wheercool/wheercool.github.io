(function() {
	widgetRegister.register("Process Insight", function(el, data, general, config) {

		var scale = d3.scale.linear().domain([0, 5, 10]).range(['#31a354', '#ff9800' , '#e51c23']);
		// var data = [
		// {
		// 	name: 'Booking',
		// 	value: 0
		// },
		// {
		// 	name: 'Planning',
		// 	value: 10
		// },
		// {
		// 	name: 'Waiting',
		// 	value: 3
		// },
		// {
		// 	name: 'Examination',
		// 	value: 10
		// },
		// {
		// 	name: 'Reporting',
		// 	value: 4
		// }, {
		// 	name: 'Invoicing',
		// 	value: 8
		// }
		// ];

		var tpl = uncomment(function() {/*
				
			<div class="panel panel-default">
				<div class="panel-heading"><h4>Booking</h4>
				</div>
				<div class="panel-body">
					<svg width="100%" height="100%" viewBox="-5 -30 210 210">
					<g transform="translate(100,100)"><path id="planning" stroke="gray" stroke-width="7" fill="#353535" d="M-86.60254037844388,49.99999999999997A100,100 0 1,1 86.60254037844388,49.999999999999986L69.2820323027551,39.999999999999986A80,80 0 1,0 -69.28203230275511,39.99999999999998Z"></path>

						<image x="-35" y="-30" height="75px" width="75px"/>
						<text font-size="32px" font-weight="bold" fill="#353535"  y="75" x="-40" ></text>
					</g>
				</svg>
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
	

		cols.select('.panel-body svg image')
			.attr('xlink:href', function(d, i) {
				return d.link || 'imgs/' + d.name + '.svg';
			});

		

		cols.select('.panel-body .text')
			.text(function(d) {
				return d.value + ' ' + d.measure;
			})


		d3.select(window).on('scroll', animate);

		function animate() {
			var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0],
			    x = w.innerWidth || e.clientWidth || g.clientWidth,
			    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			    cols.each(function(d) {
			    	var rect = this.getBoundingClientRect();
			    	var height = parseInt(d3.select(this).style('width'), 10);

			    	if (rect.top + height < y) {
			    		var data = d3.select(this).datum();
			    		if (data.animated) return;
			    		data.animated = true;
			    		d3.select(this).datum(data);
			    		
			    		d3.select(this)
			    		.select('.panel-body svg path')
			    		.attr('fill', 'gray')
			    		.transition()
						.duration(1000)
						.attr('fill', function(d) {
							return scale(d.value);
						});
			    	}
			    });
		};
	}
	

	render();

		return {
			render: render
		};

	});
})()