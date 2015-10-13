(function() {

	widgetRegister.register("Department Insight", function(el, data, general, config, all) {
	   	/* Default settings */
	   	var legendItemHeight = 13,
	   		legendGap = 5;
		var tpl = uncomment(function() {/*
				<div class="row ">
					
				</div>
				
				<div class="row" >

						<div class="col-md-6">
							<div class="row">
								<div class="text-center col-md-4">
									<img class="hospital-icon" src="imgs/hospital.svg" width="90%"/>
								</div>
								<div class="col-md-8">
									<table class="table">
										<thead>
											<tr>
												<th>Department</th>
												<th>Total</th>
												<th>Average</th>
											</tr>
										<thead>
										<tbody>
											<tr>
												<td>
												<div class="select-style">
													<select>
														<option>Department 1</option>
														<option>Department 2</option>
														<option>Department 3</option>
													</select>
													</div>
												</td>
												<td class="departament-total"></td>
												<td class="departament-avg"></td>
											</tr>
										</tbody>
									</table>
								</div>
	
							</div>
							
						</div>

						<div class="col-md-6"/>
							<ol class="breadcrumb date-filter text-center">
							</ol>
							<div class="departament-date"></div>
						</div>

						
				</div>
				<!-- end of the first row -->

				<div class="row">
					<!-- First Pie section -->

					<div class="col-md-6">	
						<div class="row">
							<h5 class="text-center">Examinations Per Group</h5>
						</div>

						<div class="row">					
							<div class="col-md-6 ">
								<div class="row departament-per-group departament-pie text-center">
									<span class="h5">
									<small>
							          Current filter: <span class='default-value'>none</span><span class='filter'></span>	
							          </small>			          
							        </span>
						        </div>
					        </div>
								
							<div class="col-md-6 department-per-group-legend"></div>
						</div>
					</div>
					<!-- end of the first pie section -->

					<div class="col-md-6">
						<div class="row">
							<h5 class="text-center">Examinations Per Employee</h5>
						</div>

						<div class="row">
							<div class="col-md-6">
								<div class="row departament-per-employee departament-pie text-center">
									<span class="h5">
									<small>Current filter: <span class="default-value">none</span> <span class='filter'></span></small>			          
							        </span>
							    </div>
							</div>

							<div class="col-md-6 department-per-employee-legend"></div>
						</div>

						
					</div>
				</div>*/});
		// document.write('TPL');
		// document.write(tpl);
		d3.select(el)
			.html(tpl);

		if (config.iconPath) {
			d3.select('.hospital-icon')
				.attr('src', config.iconPath);
		}

		var onFiltered = seq(drawResetButtons, makeRadioButton(), addDefaultFilterValue);

		var perGroupLegendSvg = d3.select('.department-per-group-legend').append('svg');
		var perEmployeeLegendSvg = d3.select('.department-per-employee-legend').append('svg');

		//Settings
		var perGroupSlices = config.perGroup? (config.perGroup.maxSlices || 20): 20;
		var perEmployeeSlices = config.perEmployee? (config.perEmployee.maxSlices || 20): 20;
		var perGroupColorPalette = config.perGroup? (config.perGroup.colorPalette || d3.scale.category20c().range()): d3.scale.category20c().range();
		var perEmployeeColorPalette = config.perEmployee? (config.perEmployee.colorPalette || d3.scale.category20b().range()): d3.scale.category20b().range();
		

		//CreateCharts

		perGroup = dc.pieChart(d3.select(el).select('.departament-per-group.departament-pie').node())		   
		    .minAngleForLabel(0.5)
		    .slicesCap(perGroupSlices)			   
		    .colors(d3.scale.ordinal().range(perGroupColorPalette))
		    // .label(function(d) {
		    //     var names = d.key.split(' ');
		    //     // return names[0][0] + '. ' + names[1][0] + '.';
		    //     return d.value || '';
		    // }) 
		    .on('filtered', onFiltered)
	   

	   

		perEmployee = dc.pieChart(d3.select(el).select('.departament-per-employee').node())		
		    .slicesCap(perEmployeeSlices)
		    .minAngleForLabel(0.5)			    
		    .colors(d3.scale.ordinal().range(perEmployeeColorPalette))
		    // .label(function(d) {
		    //     var names = d.key.split(' ');
		    //     // return names[0][0] + '. ' + names[1][0] + '.';
		    //     return d.timeValue || '';
		    // })
 			.on('filtered', onFiltered)
		   

		departamentDropdown = dc.dropdown('.select-style');

		d3.select(window).on('resize', redraw);

	    var updateStatistic =  function(rec) {
	  		var total = rec.crs.groupAll().reduceSum(dc.pluck('Examination')).value();
	  		totalEmployees = rec.perEmployeeGroup.all().length;
	  		totalTypes = rec.perGroupGroup.all().length;

	  		d3.select('.departament-avg')
	  			.html((+(total / totalEmployees).toFixed(2)).toLocaleString());

	  		d3.select('.departament-total')
	  			.html(total.toLocaleString());

	  	};

	  	totalTypes = 0,
	  	totalEmployees = 0;
	  	var currentService = config.url? remoteService(all.datasetUrl.url): service;

		yearChart = makeChart('.departament-date', currentService, {
		  rebindData: function(rec) {
		  	updateChartsSizes();

		  	perGroup.dimension(rec.perGroup)
		    	.group(rec.perGroupGroup)			    	
		    	.filter(perGroup.filter())
		    	// .redraw()

		    perEmployee.dimension(rec.perEmployee)
		    	.group(rec.perEmployeeGroup)
		    	.filter(perEmployee.filter())

		    departamentDropdown
		    	.dimension(rec.departament)
		    	.group(rec.departamentGroup)
		    	.filter(departamentDropdown.filter())
		    	
		
		   	redraw();
		  },
		  drillDown: updateStatistic,
		  rollUp: updateStatistic
		});

		updateChartsSizes();
		render();

	    return {
    		render: render
	    };

	    function updateChartsSizes() {
	    	var ws = getCurrentWidth();
			widthperGroup = ws[0],
			widthPerEmployee = ws[1],
			widthDate = ws[2],
			legendHeightType = Math.min(totalTypes, perGroupSlices) * (legendItemHeight + legendGap),
			// heightperGroup = widthperGroup + legendHeightType,
			heightperGroup = widthperGroup,
			legendHeigthEmployee = Math.min(totalEmployees, perEmployeeSlices) * (legendItemHeight + legendGap),
			// heightPerEmployee = widthPerEmployee + legendHeigthEmployee;
			heightPerEmployee = widthPerEmployee;

	   		perGroupLegendSvg.attr('height', legendHeightType);
		    perEmployeeLegendSvg.attr('height', legendHeigthEmployee);


			perGroup
				.width(widthperGroup)
		    	.height(heightperGroup)
		    	.radius(widthperGroup/2.5)
			    .innerRadius(widthperGroup / 5)  
		    	 .legend(
		    	dc.htmlLegend()
		    	.container( perGroupLegendSvg )
		    	.x(0.1 * widthperGroup)
		    	// .y(widthperGroup)
		    	.itemHeight(legendItemHeight)
		    	.gap(legendGap)
		    	)
		
		     	

		   	perEmployee
	        .width(widthPerEmployee)
		    .height(heightPerEmployee)
		    .radius(widthPerEmployee / 2.5)
		    .innerRadius(widthPerEmployee / 5) 
		    .legend(dc.htmlLegend()
			    	.container(perEmployeeLegendSvg)
			    	.x(0.1 * widthPerEmployee)
			    	.y(0).itemHeight(legendItemHeight).gap(legendGap))


		   	yearChart.
		   		width(widthDate);

		   	return ws.every(function(d) { return !isNaN(d)})

	    }

	    function getCurrentWidth() {
			return [
				getWidth(d3.select(el).select('.departament-per-group')),
				getWidth(d3.select(el).select('.departament-per-employee')),
				getWidth(d3.select(el).select('.departament-date'))
			];
		}
		function getWidth(el) {
			return parseInt(el.style('width'), 10);
		}
		function getWidthWithoutPadding(el) {
			return parseInt(el.style('width'), 10) - parseInt(el.style('padding-left'), 10) - parseInt(el.style('padding-right'), 10)
		}
		//Gets the data from the server and then redraw
		function render() {
			yearChart.render();
    	}

    	function redraw() {
    		var ok = updateChartsSizes();
    		if (!ok) return;
    		dc.renderAll();
    		drawResetButtons(el);
    	}

    	function drawResetButtons() {
		
			d3.select(el).select('.departament-per-employee svg .reset')
				.remove();

			d3.select(el).select('.departament-per-employee svg')
		
				.append('text')
				.classed('reset', true)
				.style('display', function() { return perEmployee.hasFilter() ? 'block': 'none';  })
				.attr('x', widthPerEmployee / 2)
				.attr('y', heightPerEmployee / 2)
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.attr('font-size', 16)
				.attr('font-weight', 'bold')
				.attr('fill', '#066784')
				.attr('cursor', 'pointer')
				.text('reset')
				.on('click', function() {
					perEmployee.filterAll();
					redraw();
				})

				d3.select(el).select('.departament-per-group svg .reset')
					.remove();

			d3.select(el).select('.departament-per-group svg')	
				.append('text')
				.classed('reset', true)
				.style('display', function() { return perGroup.hasFilter() ? 'block': 'none';  })
				.attr('x', widthperGroup / 2)
				.attr('y', heightperGroup / 2)
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.attr('font-size', 16)
				.attr('font-weight', 'bold')
				.attr('fill', '#066784')
				.attr('cursor', 'pointer')
				.text('reset')
				.on('click', function() {
					perGroup.filterAll();
					redraw();
				})
		}
	});



	

	function prop(nm) {
	    return function(obj) {
	        return obj[nm];
	    };
	}

	

	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

	function addDefaultFilterValue(chart) {	
		chart.root()
			.select('.default-value')
			.style('display', function(){ return chart.hasFilter()?'none': 'inline' });

		// drawResetButtons(chart.root().node(), this)
		
	}

	function seq(f1, f2, f3) {
		return function(d, i) {
			f1(d, i);
			f2(d, i)
			return f3(d, i);
		};
	}
	function makeRadioButton() {
		var filtered = false;
		return function(chart, value) {
		    	if (filtered) return;
		    	filtered = true;
		    	chart.filterAll();
		    	chart.filter(value);
		    	filtered = false;		    	
	    }
	}


	function delay(ms) {
      var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, ms)
      });
      return promise;
    };

	var data = [];

	var types = ['CP', 'MR', 'RE', 'DT', 'VG'],
		employees = ['John', 'Bill', 'Max', 'Alex', 'David', 'Sasha'],
		yearCount = 10;

	for (var department = 0; department < 3; department++) {
		for (var type = 0; type < types.length; type++) {
			for (var employee = 0; employee < employees.length; employee++) {
				for (var year = 2008; year < 2008 + yearCount; year++) {
					for (var month = 1; month <= 12; month++) {
						for (var day = 1; day <= 31; day++) {
							data.push({
								'Department': 'Department ' + department,
								'ExaminationGroup': types[type],
								'Radiologist': employees[employee],
								'Year': year,
								'Month': month,
								'Day': day,
								'Examination': Math.floor(Math.random() * employees[employee].length * 10) * department
							});
						}
					}
				}
			}
		}
	}
	var reducer = function(by) {
		var init = {			
		};

		return [function(acc, next) {
			var key = next.ExaminationGroup + '-' + next.Radiologist + '-' +  next[by] + '-' + next.Department;
			if (!acc[key]) acc[key] = 0;
			acc[key] += next.Examination;
			return acc;
		}, init];
	};

	var groupBy = function(data, by) {
		var groups = data.reduce.apply(data, reducer(by));
		var res = [];
		for (var key in groups) {
			var values = key.split('-');
			res.push({
				ExaminationGroup: values[0],
				Radiologist: values[1],
				Examination: groups[key],
				timeValue: values[2],
				Department: values[3]
			});

		}
		return res;
	} 

	// var cf = crossfilter(data),
	// 	dimension: {
	// 		all: cf.dimension(function() {

	// 		})
	// 	},
	// 	groups: {
	// 		all: .group().reduceSum.apply(this, reducer)

	// 	};
		

	data.forEach(function(d) { d.Week = Math.floor(d.Day / 8) + 1; });


	function remoteService(url) {
		var count = 0;

		return function(filter) {
			count++;
			var promise = new Promise(function(resolve, reject) {
				window['callback' + count] = function(response) {
					resolve(response);
				}
				var filterParams = '';
				for (var p in filter) {
					filterParams += '&' + p + '=' + filter[p];
				}
				var src = url + '?callback=callback-' + count + filterParams + '&by=' + levels[currentLevel];
				d3.select(document.body)
					.append('script')
					.attr('src', src)

			});

			return promise;

		}
		

	}


	function service(filter) {
		  d3.select('.waiting')
		  	.style('display', 'block')

	      return delay(1000).then(function() {
	      	// if (filter.day) {
	       //       dataset = groupBy(data, 'Week');;
	       //       dataset.forEach(function(d) {
		      //        d.value = d.Week;
		      //     });
	       //  } else 
	        if (filter.week) {
	        	var dataset = data
	         		.filter(function(d) { return d.Year == filter.year && d.Month == filter.month  && d.Week == filter.week});

	          dataset = groupBy(dataset, 'Day');
	           //   dataset.forEach(function(d) {
		          //    d.value = d.Day;
		          // });
	        } else
	        if (filter.month) {
	        	var dataset = data
	         		.filter(function(d) { return d.Year == filter.year && d.Month == filter.month  });

	         	
	         	dataset = groupBy(dataset, 'Week');
	         		
	           //   dataset.forEach(function(d) {
		          //    d.value = d.Week;
		          // });
	        } else
	        if (filter.year) {
	          dataset = groupBy(data.filter(function(d) {return d.Year == filter.year}), 'Month');;
	           //   dataset.forEach(function(d) {
		          //    d.timeValue = d.Month;
		          // });
	        } else 
	        {
	        	dataset = groupBy(data, 'Year');
	        	// dataset.forEach(function(d) {
		        //     d.timeValue = d.Year;
		        // });		        
	        }
	        dataset.forEach(function(d) { d.timeValue = +d.timeValue;})
	        return dataset;
	    }).then(function(d) {
	    	d3.select('.waiting')
		  	.style('display', 'none')
		  	return d;
	    })

	          	
  	}
  	



    function log(d) {
    }

var levels = ['year', 'month', 'week', 'day']
 var currentLevel = 0;

function makeChart(el, service, callback) {
    var filter = {}; //parameter to the query and to display

     //, 'partOfDay']; // ->
   
    var beautifyAxis = {
      month: ['0', "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
      // month: ["nothing", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
      week: ['week 0', 'week 1', 'week 2', 'week 3', 'week 4', 'week 5']
    };

    var datas = [];
    var chart = dc.barChart(el)
      // .width(800)
      .height(200)
      .margins({
      	top: 10,
      	left: 50,
      	bottom: 50,
      	right: 20
      })
      // .dimension(rec.dimension)
      // .group(rec.group)
      // .x(d3.time.scale().domain(extent));
      .on("filtered", function(self, d) {
          var f = self.filter();
          if (self.hasFilter() && currentLevel < levels.length - 1) {
              filter[levels[currentLevel]] = f;
              currentLevel++;              
              self.filterAll();
               service(filter)
	          .then(drillDown)
	          .then(redraw.bind(null, self));          	          
              return;
         } 
      })      
      .elasticY(true)
      .xUnits(dc.units.ordinal);

    // var pieChart = dc.pieChart('.pie-chart')
    //   .width(300)
    //   .height(300)
    //     .radius(100)
        


   
	
    function drillDown(data) {   
        var crs = crossfilter(data),
            dimension = crs.dimension(function(d) { return d.timeValue}),
            perGroup = crs.dimension(prop('ExaminationGroup')),
            perEmployee = crs.dimension(prop('Radiologist')),
			perEmployeeGroup = perEmployee.group().reduceSum(dc.pluck('Examination')),

            perGroupGroup = perGroup.group().reduceSum(dc.pluck('Examination')),
            // pieDimension = crs.dimension(function(d) { return d.employee}),
            group = dimension.group().reduceSum(function(d) { return d.Examination}),

            departament = crs.dimension(dc.pluck('Department')),
            departamentGroup = departament.group().reduceCount();

            // pieGroup = pieDimension.group().reduceSum(function(d) {return d.examination});
        var rec = {
        	  data: data,
	          crs: crs,
	          dimension: dimension,
	          group: group,
	          perGroupGroup: perGroupGroup,
	          perEmployeeGroup: perEmployeeGroup,
	          perGroup: perGroup,
	          perEmployee: perEmployee,
	          departament: departament,
	          departamentGroup: departamentGroup,
	          // extent: d3.extent(data, function(d) { return d.date}),
	          range: group.all().map(function(d) {return d.key}),
          // pieDimension: pieDimension,
          // pieGroup: pieGroup
        };
        datas.push(rec);
        callback.drillDown(rec);    
    }

    function rollUp(n) {
      var i, data;
      if (!n) n = 1;
      for ( i = 0; i < n; i++) {
      	data = datas.pop();
      	currentLevel--;
      	delete filter[levels[currentLevel]];   

      }
     
      chart.filterAll() 
      callback.rollUp(peek(datas));  
    }

 	function peek(a) {
	    return a[a.length - 1];
    }
    function redraw(self, needRedraw) {
        var rec = peek(datas);
        // var pieFilters = pieChart.filters();
       

        // if (!pieFilters.length) {
        //   pieFilters = null;
        // }
        
       // rec.pieDimension.filter(pieChart.filter());
        var filterBy = levels[currentLevel]; 
        self.xAxis().tickFormat(function(d) {

        	return beautifyAxis[filterBy] && beautifyAxis[filterBy][d]? beautifyAxis[filterBy][d]: d;
        }) //rec.keyAccessor)
        self.title(function(d) {
        	return beautifyAxis[filterBy] && beautifyAxis[filterBy][d.key]? beautifyAxis[filterBy][d.key]: d.key + '-' +
        	d.timeValue;
        }) //rec.keyAccessor)

        self.dimension(rec.dimension)
        self.group(rec.group)
        self.x(d3.scale.ordinal().domain(rec.range))
        self.xUnits(dc.units.ordinal)


        //Some magic for old version
        // self.expireCache()
        // self.rescale();

        // if (needRedraw) {
        // 	self.redraw();
        // } else {
        // 	self.render();	
        // }
        

        // self.stack();

        var value, filterValue = ['All'], lastFilterValue = 'All';
        levels.forEach(function(d) {
        	 if (filter[d]) {
        	 	
        		lastFilterValue = beautifyAxis[d]? beautifyAxis[d][filter[d]]: filter[d];
        		filterValue.push(lastFilterValue);
        	}
        });

        d3.select('.date-filter')
        	.html('')

        var filterValueItem = d3.select('.date-filter')
        	.selectAll('li')
        	.data(filterValue)

        	filterValueItem.enter()
        	.append('li')
        	.classed('active', false)
        	.each(function(d, i) {
        		if (d == lastFilterValue) {
        			d3.select(this)
        				.classed('active', true)
        				.text(function(d) {
			        		return d;
			        	})
        		} else {
        			d3.select(this)
        				.append('a')
			        	.attr('href', '#')
			        	.text(function(d) {
			        		return d;
			        	})
        		}
        	})
        	.on('click', function(d, i) {
        		if (d != lastFilterValue) {
    				rollUp(currentLevel - i);
        			redraw(self, false);
        			
        			// redraw(self, true);
        		}
        	})

        	d3.select('.date-filter')
        		// .append('li')
        		.append('a')
        		.attr('class', 'pull-left')
        		.classed('hide', currentLevel == 0)
        		.attr('href', '#')
        		.on('click', function() {
        			rollUp();
        			redraw(chart);
        		})
        		.append('span')
        		.attr('class', 'glyphicon glyphicon-arrow-left')
        		

        	// filterValueItem.exit().remove()

        // if (filter.day) {
        //   value = `year=${filter.year}, month=${filter.month}, day=${filter.day}`;        
        // } else
        // if (filter.week) {
        //   value = `year=${filter.year},month=${filter.month}, week=${filter.week}`;
        // } else 
        // if (filter.month) {
        //   value = `year=${filter.year},month=${filter.month}`;
        // } else
        // if (filter.year) {
        //   value = `year=${filter.year}`
        // }
        // else {
        //   value = 'All';
        // }


        
        // d3.select('.filter-value')
        //   .html(value)
      

        callback.rebindData(rec);  
        // self.stack();
        // var pFilter = pieChart.filter();
        // pieChart
        //   .dimension(rec.pieDimension)
        //   .group(rec.pieGroup)
        //   // .filter(pFilter)

		
	        //   .render()
	    }
	    return {
			redraw: redraw.bind(null, chart, true),
			render: function() {
				 service(filter)
		          .then(drillDown)
		          .then(redraw.bind(null, chart));
			},
			width: chart.width				

		};


	};


	
})();