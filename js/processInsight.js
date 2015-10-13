
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

  		
	    function redrawTopCharts() {
			objectToArray(topLevelData()).forEach(function(d) {
		    	topLevelCharts[d.key]
		    	.data( objectToArray(d.value))
		    	.redraw();

		    });
	    }

	    function redrawDeepCharts() {
	    	 objectToArray(deepLevelData()).forEach(function(d, i) {
		    	var data = [];
		    	var key = topFilterValue == 'All'? 'group': 'type';
		    	var data = objectToArray(d.value).map(function(d) { var res = {examinations: d.value[1], key: d.key};return res; });
				var chart = deepLevelCharts[d.key];
		    	chart.data = data;
		    	// chart.setBounds(10, 15, chart.width - 10, chart.height - 70)
		    	var h = data.length * 35;
		    	var container = chart.svg.node().parentNode

		    	var margin = {
		    		left: 105,
		    		top: 5,
		    		right: 5,
		    		bottom: 55 
		    	};

		    	var w = container.offsetWidth || 200;
		    	var width = w - margin.left - margin.right;
		    	var height = h - margin.top - margin.bottom;

		    	chart.svg.attr('height', h);
		    	chart.svg.attr('width', w);

		    	chart.height = h;

		    	if (!w) return;
				chart.setBounds(margin.left, margin.top, width, height)				
		    	chart.draw(2000);

		    	chart.svg.select('.dimple-axis.dimple-title.dimple-custom-axis-title.dimple-axis-y').text(key);
		    	
		    }); 
	    }

	    function redrawAll() {
	    	redrawCards();
	    	redrawTopCharts();
	    	redrawDeepCharts();
	    }
		// var statusIndicatorIcons = config.stepIndicatorIcons || {
		// 	"ok": "imgs/neutral_trading.svg",
		// 	"bad": "imgs/bearish.svg",
		// 	"good": "imgs/bullish.svg"
		// };

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

		var topTpl = uncomment(function() {/*
				<div class="top">	
					<div class="panel panel-default">
							<div class="panel-heading process-header">
								<span class="h4">Booking</span>								
								
                            </div>			
						
							<div class="panel-body text-center">
								<img width="60%"  style="min-height:77px"/>
								<div style="height:90px"  class="status-indicator text-center"></div>
								<h4 class="text text-center"></h4>

							</div>

					</div>
				</div>

				
	*/});

	var deepTpl = uncomment(function() {/*
				<div class="deep">
					<div class="panel panel-default">
						<div class="panel-heading process-header">
						<div class="pull-right">
                                <div class="btn-group">
                                   <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>                                  
                                </div>
                            </div>	
							<span class="h4">Booking</span>
										
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

var onDeepClick = function(d) {
			// this.classList.toggle('flipped');
			// this.classList.toggle('col-sm-2');
			// this.classList.toggle('col-sm-6');
			// this.classList.toggle('detail');
			// this.parentElement.classList.toggle('md');
			var b = d3.select(d3.event.target)
			// debugger;
			var top = d3.select('#top-' + d.key),
				deep = d3.select('#deep-' + d.key);
			
			// top
			// .classed('hidden', !top.classed('hidden'));

			deep
				.classed('animated', true)
				.classed('zoomOut', true)

			setTimeout(function() {
				deep
				.classed('animated', false)
				.classed('zoomOut', false)
				.classed('hidden', !deep.classed('hidden'));

			}, 800);
			

		};

		var onTopClick = function(d) {
			// this.classList.toggle('flipped');
			// this.classList.toggle('col-sm-2');
			// this.classList.toggle('col-sm-6');
			// this.classList.toggle('detail');
			// this.parentElement.classList.toggle('md');
			var b = d3.select(d3.event.target)
			// debugger;
			var top = d3.select('#top-' + d.key),
				deep = d3.select('#deep-' + d.key);
			

			// top
			// .classed('hidden', !top.classed('hidden'));
			top.classed('animated', true);
			top.classed('pulse', true);

			deep
				.classed('hidden', false)
			
				.classed('animated', true)
				.classed('zoomIn', true)

			setTimeout(function() {
				top.classed('animated', false);
				top.classed('pulse', false);



					deep

					.classed('animated', false)
					.classed('zoomIn', false)
					redrawDeepCharts();		
				

			}, 800)


		};

		function redrawCards() {

		var sortedData = objectToArray(topLevelData()).sort(sortFunc)

		var deepLevelSteps = d3.select(el)
			.select('.top-row')
			.selectAll('.step')
			.data(sortedData)


		var topLevelSteps = d3.select(el)
			.select('.deep-row')
			.selectAll('.step')
			.data(sortedData);

		

		deepLevelSteps.enter()
			.append('div')
			.attr('class', 'step col-sm-6 hidden')
			.attr('id', function(d) { return 'deep-' + d.key; })
			

			.html(deepTpl)

		deepLevelSteps.select('.close')
			.on('click', onDeepClick)

		topLevelSteps
		.enter()
		.append('div')
		.attr('class', 'step col-sm-2 flipper')
		.attr('id', function(d) { return 'top-' + d.key; })

	
		.on('click', onTopClick)
		.html(topTpl)



		topLevelSteps.select('.top .panel-heading > .h4')
			.text(function(d) { return d.key})	

		deepLevelSteps.select('.deep .panel-heading > .h4')
			.html(function(d) { return d.key + '<small><br />Examinations outside</small>'})	

		topLevelSteps.select('.panel-heading')
			.style('color', 'white')
			.style('background-color', function(d) {
				return statusBackgroundColorTable[d.value[1] > 0? 'bad'
									: d.value[-1] > 0? 'good'
									: 'ok'];
			})

		topLevelSteps.select('.panel-body')
			.style('background-color', function(d) {
				return statusOpacityBackgroundColorTable[d.value[1] > 0? 'bad'
													:d.value[-1] > 0? 'good'
													: 'ok'];
			})			


		topLevelSteps.select('.panel-body img')
			.attr('src', function(d, i) {
				return d.link || 'imgs/' + d.key + '.svg';
			});

		topLevelSteps.select('.top .panel-body .status-indicator')
			.each(function(d) {

				topLevelCharts[d.key]?topLevelCharts[d.key]: (topLevelCharts[d.key] = trendChart(this).height(70));
				topLevelCharts[d.key].svg()
					.attr('viewBox', '0 -25 100 100')
					.style('width', '100%')
					.style('height', '100%')
			})
		deepLevelSteps.select('.deep .detail-container')
			.each(function(d) {
				if (!deepLevelCharts[d.key]) {
					var svg = dimple.newSvg(this, 150, 250);
					var chart = new dimple.chart(svg, []);
					chart.defaultColors = [
					    new dimple.color("red")
					];
					// chart.setBounds(45, 20, 100, 80)
					chart.addMeasureAxis("x", "examinations");
			        var y = chart.addCategoryAxis("y", "key");
			        y.addOrderRule("examinations");
			        var shape = y.titleShape;

					chart.addSeries(null, dimple.plot.bar);
					deepLevelCharts[d.key] = chart;
				}
			})			

		topLevelSteps.select('.panel-body .text')
			.text(function(d) {
				return d.value[1] > 0? (d.value[1] + ' outside')
						: d.value[-1] > 0? (d.value[-1] + ' ahead')
						: (d.value[0] + ' on time');
			})
			.style('color', function(d, i) {
				return statusColorTable[d.value[1] > 0? 'bad': d.value[-1]>0? 'good' :'ok'];
			})
		}

	function render () {
		d3.select(el).html(''); //clear

		var firstRow = d3.select(el)
			.append('div')
			.attr('class', 'row')
			.style('padding-bottom', '10px')


			firstRow.append('div')
			.attr('class', 'col-md-4 text-center')
			.style('padding', '6px')

			.text('Examination Group:')

			var secondColumn = firstRow.append('div')
			.attr('class', 'col-md-4 text-center')			
			.each(function() {


				var group = d3.select(this)
					.append('div')
					.attr('class', 'form-group')

					group.append('span')
					// .text('Examination Group')

				var self = group.append('div')
				.attr('class', 'select-style text-center')

				

				processTopFilter(self.node())
			    	.data(objectToArray(exGroups))
			    	.redraw()
			    	.callback(function(d) {
			    		topFilterValue = d == 'All'?null: d;
			    		redrawAll();
			    	});
			})


			firstRow
				.append('div')
				.attr('class', 'col-md-4 text-right')
				.append('img')
				.attr('src', 'imgs/legend.svg')
				.style('border', '1px solid #ccc')
				.style('border-radius', '3px')

		
		var deepLevelSteps = d3.select(el)
			.append('div')
			.classed('row', true)
			.classed('top-row', true)

		var topLevelSteps = d3.select(el)
			.append('div')
			.classed('row', true)
			.classed('deep-row', true)

		redrawAll();
		d3.select(window).on('resize', redrawDeepCharts);
	}
	


	render();

		return {
			render: render
		};

	});



		

})()