
	function getCategory(d) { return d.duration < d.min? -1:
				(d.duration > d.max? +1: 0);}

	function topLevelReducer(acc, next) {
		if (!acc[next.step]) { acc[next.step] = { "-1": 0, "0": 0, "1": 0}}
		acc[next.step][next.category] += 1;
		return acc;
	}

	function deepLevelReducer(by) {
		//by = 'ex_group' | 'ex_type'
		return function(acc, next) {
			//filter
			//if (next.step != step) return acc;
			if (!acc[next.step]) acc[next.step] = {};
			var innerAcc = acc[next.step];
			var byValue = next[by];
			if (!innerAcc[byValue]) {innerAcc[byValue] = { "-1": 0, "0": 0, "1": 0}}
			innerAcc[byValue][next.category] += 1;
			return acc; 		
		};
	}


    function topFilter(value) {
    	return value == null? function(d) {return d;}
    	:function(d) {
    		return d.ex_group == value;
    	}
    }

    
  
    function objectToArray(obj) {
    	var res = [];
    	for (var key in obj) {
    		res.push({
    			key: key,
    			value: obj[key]
    		});
    	}
    	return res;
    }
    
(function() {
	widgetRegister.register("Process Insight", function(el, data, general, config) {
		var topFilterValue = null;

		topLevelCharts = {};
   		deepLevelCharts = {};


		var stepOrder = {}, exGroups = {};
		data.forEach(function(d) {
			d.category = getCategory(d);
			exGroups[d.ex_group] = d.ex_group;
			stepOrder[d.step] = d.step_pos;
		})
		var sortFunc = function(a, b) {return stepOrder[a.key] - stepOrder[b.key]; };

	  	var topLevelData = function() {
	    	return data.filter(topFilter(topFilterValue)).reduce(topLevelReducer, {});
	    }
	    var deepLevelData = function() {
	    	return data.filter(topFilter(topFilterValue)).reduce(deepLevelReducer(topFilterValue == null?'ex_group': 'ex_type'), {});
	    };

  		

	     function redrawAll() {
    	// try {

	    	objectToArray(topLevelData()).forEach(function(d) {
		    	topLevelCharts[d.key]
		    	.data( objectToArray(d.value))
		    	.redraw();

		    });
		    objectToArray(deepLevelData()).forEach(function(d) {
		    	var data = [];
		    	var data = objectToArray(d.value).map(function(d) { return {key: d.key, value: d.value[1]}});
				var chart = deepLevelCharts[d.key];
		    	chart.data = data;
		    	// chart.setBounds(10, 15, chart.width - 10, chart.height - 70)
		    	chart.height = data.length * 25;
		    	var container = chart.svg.node().parentElement
		    	var w = container.offsetWidth;
		    	
		    	chart.svg.attr('height', data.length * 15 + 90);
		    	chart.svg.attr('width', w);
				chart.setBounds(45, 20, w - 50, chart.height)
				
		    	chart.draw();
		    });
			// }
			// catch(ex) {

			// }

	    }
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

		var tpl = uncomment(function() {/*
				<div class="front">	
					<div class="panel panel-default">
							<div class="panel-heading process-header">
								<h4>Booking</h4>				
							</div>
							<div class="panel-body text-center">
								<img width="60%" />
								<div style="height:100px"  class="status-indicator text-center"></div>
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
							<div class="detail-container"></div>
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

		d3.select(el)
			.append('div')
			.attr('class', 'row')
			.append('div')
			.attr('class', 'pull-right')
			.each(function() {
				processTopFilter(this)
			    	.data(objectToArray(exGroups).sort(sortFunc))
			    	.redraw()
			    	.callback(function(d) {
			    		topFilterValue = d == 'All'?null: d;
			    		redrawAll();
			    	});
			})
		var cols = d3.select(el)
		.append('div')
		.classed('row', true)
		.selectAll('.step')
		.data(objectToArray(topLevelData()));


	var cols2 = d3.select(el)
		.append('div')
		.classed('row', true)
		.selectAll('.step')
		.data(objectToArray(topLevelData()));


		cols
		.enter()
		.append('div')
		.attr('class', 'step col-sm-2 flipper')
	
		.on('click', function() {
			this.classList.toggle('flipped');
			this.classList.toggle('col-sm-2');
			this.classList.toggle('col-sm-6');
			this.classList.toggle('detail');
			this.parentElement.classList.toggle('md');

		})
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
			redrawAll();
		});


		cols.select('.front .panel-heading > h4')
			.text(function(d) { return d.key})	

		cols.select('.back .panel-heading > h4')
			.text(function(d) { return d.key})	

		cols.select('.panel-heading')
			.style('color', 'white')
			.style('background-color', function(d) {
				return statusBackgroundColorTable[d.value[1] > 0? 'bad': 'ok'];
			})

		cols.select('.panel-body')
			.style('background-color', function(d) {
				return statusOpacityBackgroundColorTable[d.value[1] > 0? 'bad': 'ok'];
			})			


		cols.select('.panel-body img')
			.attr('src', function(d, i) {
				return d.link || 'imgs/' + d.key + '.svg';
			});

		cols.select('.front .panel-body .status-indicator')
			.each(function(d) {
				topLevelCharts[d.key] = trendChart(this).height(70);
			})

		cols.select('.back .detail-container')
			.each(function(d) {
				var svg = dimple.newSvg(this, 150, 250);
				var chart = new dimple.chart(svg, []);
				chart.defaultColors = [
				    new dimple.color("red")
				];
				// chart.setBounds(45, 20, 100, 80)
				chart.addMeasureAxis("x", "value");
		        var y = chart.addCategoryAxis("y", "key");
		        y.addOrderRule("value");
		        
				chart.addSeries(null, dimple.plot.bar);
				deepLevelCharts[d.key] = chart;
			})

			// .attr('viewBox', '35 10 180 100')
			// .attr('preserveAspectRatio', 'xMidYMid meet')

			// indicator.append('path')
			// 	.attr('stroke', "#31a354")
			// 	.attr('fill', 'none')
			// 	.attr('d', "M 45 99.99999999999999 C 44.999999999999986 71.41875280734692 60.24791385931975 45.00859129357144 84.99999999999999 30.717967697244916")
			// 	.attr('stroke-width', 15)
				
			// indicator.append('path')
			// 	.attr('stroke', "#ccc")
			// 	.attr('fill', 'none')
			// 	.attr('d', "M 85.00000000000001 30.717967697244887 C 109.75208614068028 16.427344100918347 140.24791385931977 16.42734410091836 165 30.717967697244887")
			// 	.attr('stroke-width', 15)

			// indicator.append('path')
			// 	.attr('stroke', "red")
			// 	.attr('fill', 'none')
			// 	.attr('d', "M 165 30.717967697244916 C 189.75208614068026 45.00859129357145 205 71.4187528073469 205 99.99999999999999")
			// 	.attr('stroke-width', 15)

			// var g = indicator.append('g')

			// 	g.append('circle')
			// 	.attr('cx', 45)
			// 	.attr('cy', 100)
			// 	.attr('r', 8);


			// g.transition()
			// 	.duration(3000)
			// 	.attrTween('transform', function tween(d, i, a) {
			// 	scale = d3.scale.linear().domain([d.min, d.max]) 
			// 						.range([0, 180])
		 //      return d3.interpolateString("rotate(90, 125 100)", "rotate(" +  scale(d.duration) + ", 125 100)");
		 //    })

			// .attr('src', function(d, i) {				
			// 	return statusIndicatorIcons[d.status];
			// })


		cols.select('.panel-body .text')
			.text(function(d) {
				return d.value[1] + ' outside';
			})
			.style('color', function(d, i) {
				return statusColorTable[d.value[1] > 0? 'bad': 'ok'];
			})

		redrawAll();
	}
	

	render();

		return {
			render: render
		};

	});
})()