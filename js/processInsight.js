
	function getCategory(d) { return d.duration < d.min? 'ahead':
				(d.duration > d.max? 'outside': 'onTime');}

	function topLevelReducer(acc, next) {
		if (!acc[next.step_id]) { acc[next.step_id] = { outside: 0, onTime: 0, ahead: 0, total: 0, totalDuration: 0}}
		acc[next.step_id][next.category] += 1;
		acc[next.step_id].total += 1;
		acc[next.step_id].totalDuration += next.duration;
		return acc;
	}

	function deepLevelReducer(by) {
		//by = 'ex_group' | 'ex_type'
		return function(acc, next) {
			//filter
			//if (next.step != step) return acc;
			if (!acc[next.step_id]) acc[next.step_id] = {};
			var innerAcc = acc[next.step_id];
			var byValue = next[by];
			if (!innerAcc[byValue]) {innerAcc[byValue] = { outside: 0, onTime: 0, ahead: 0, total: 0, totalDuration: 0}}
			innerAcc[byValue][next.category] += 1;
			innerAcc[byValue].total += 1;
			innerAcc[byValue].totalDuration += next.duration;
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
			stepOrder[d.step_id] = d.step_pos;
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
		    	.data( [{ key: -1, value: d.value.ahead}, { key: 0, value: d.value.onTime}, {key: 1, value:d.value.outside}])
		    	.redraw();

		    });
	    }

	    function redrawDeepCharts() {
	    	 objectToArray(deepLevelData()).forEach(function(d, i) {
	    	 	var data = [];
		    	var key = topFilterValue == 'All'? 'group': 'type';
	    	 	var recs = [{}, {}, {}];
				
	    	 		

	    	 	for (var prop in d.value) {
	    	 		recs[0].key = prop;
		    	 	recs[1].key = prop;
		    	 	recs[2].key = prop;

	    	 		recs[0].category = 'ahead'
	    	 		recs[1].category = 'onTime'
	    	 		recs[2].category = 'outside'
	    	 		recs[0].examinations = d.value[prop].ahead
	    	 		recs[1].examinations = d.value[prop].onTime
	    	 		recs[2].examinations = d.value[prop].outside

	    	 		data.push(recs[0]);
	    	 		data.push(recs[1]);
	    	 		data.push(recs[2]);
	    	 		recs = [{}, {}, {}];
	    	 	}
	    	 	// console.log(data);
		    	// var data = [];
		    	// var data = objectToArray(d.value).map(function(d) { var res = {examinations: d.value.outside, key: d.key};return res; });
				var chart = deepLevelCharts[d.key];
		    	chart.data = data;
		    	// chart.setBounds(10, 15, chart.width - 10, chart.height - 70)
		    	var h = data.length * 10;
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

		var stepSettings = stepSettings || {
			"APP": {
                    "measure": "days",
                    "link": "imgs/Booking.svg",
                    "title": "Booking"
                  },
                  "WAI": {
                    "measure": "mins",
                    "title": "Waiting",
                    "link": "imgs/Waiting.svg"
                  },
                  "PLA": {
                    "measure": "days",
                    "link": "imgs/Planning.svg",
                    "title": "Planning"
                  },
                  "BIL": {
                    "measure": "days",
                    "link": "imgs/Invoicing.svg",
                    "title": "Invoicing"
                  },
                  "EXA": {
                    "measure": "mins",
                    "link": "imgs/Examination.svg",
                    "title": "Examination"
                  },
                  "REP": {
                    "measure": "days",
                    "link": "imgs/Reporting.svg",
                    "title": "Reporting"
                  }
              };
        var barColors = config.barColors || {
        	"ok": "gray",
        	"bad": "#F44336",
        	"good": "#94E094"
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
			.text(function(d) {  return stepSettings[d.key].title})	

		deepLevelSteps.select('.deep .panel-heading > .h4')
			.html(function(d) { return stepSettings[d.key].title + '<small><br />Total examinations</small>'})	

		topLevelSteps.select('.panel-heading')
			.style('color', 'white')
			.style('background-color', function(d) {
				return statusBackgroundColorTable[d.value.outside > 0? 'bad'
									: d.value.ahead> 0? 'good'
									: 'ok'];
			})

		topLevelSteps.select('.panel-body')
			.style('background-color', function(d) {
				return statusOpacityBackgroundColorTable[d.value.outside > 0? 'bad'
													:d.ahead > 0? 'good'
													: 'ok'];
			})			


		topLevelSteps.select('.panel-body img')
			.attr('src', function(d, i) {
				return stepSettings[d.key].link || 'imgs/' + d.key + '.svg';
			});

		topLevelSteps.select('.top .panel-body .status-indicator')
			.each(function(d) {

				topLevelCharts[d.key]?topLevelCharts[d.key]: (topLevelCharts[d.key] = trendChart(this).height(70)).colors(function(i) {
					return i == -1? barColors.good:
							i == 0 ? barColors.ok:
							barColors.bad; 
				});
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
					    new dimple.color(barColors.good),
					    new dimple.color(barColors.ok),
					    new dimple.color(barColors.bad)
					];
					// chart.setBounds(45, 20, 100, 80)
					chart.addMeasureAxis("x", "examinations");
			        var y = chart.addCategoryAxis("y", "key");
			        y.addOrderRule("examinations");
			        var series = chart.addSeries("category", dimple.plot.bar);
			        series.addOrderRule('category')
			        // chart.addSeries(null, dimple.plot.bar);
					deepLevelCharts[d.key] = chart;
				}
			})			

		topLevelSteps.select('.panel-body .text')
			.html(function(d) {
				var precission = stepSettings[d.key].measure == 'day' || stepSettings[d.key].measure == 'days'? 1: 0;
				return (d.value.totalDuration / d.value.total).toFixed(precission) + '<br /><small>' + stepSettings[d.key].measure + '</small>';
			})
			.style('color', function(d, i) {
				return statusColorTable[d.value.outside > 0? 'bad': d.value.ahead > 0? 'good' :'ok'];
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