(function() {

	widgetRegister.register("Department Insight", function(el, data, general, config) {
	    
	   	/* Default settings */
	   	var legendItemHeight = 13,
	   		legendGap = 5;

		// var departament = crossfilter(data),
		//     all = departament.groupAll(),
		//     departamentperGroup = departament.dimension(prop('ExaminationTypeName')),
		//     departamentperGroupGroup = departamentperGroup.group(),
		//     departamentPerEmployee = departament.dimension(prop('Radiologist')),
		//     departamentPerEmployeeGroup = departamentPerEmployee.group()
		//     averageEmployee = departament.dimension(prop('Radiologist')),
		//     averageEmployeeGroup = departamentPerEmployee.groupAll();
		    
		
		// var totalTypes = departamentperGroupGroup.all().length,
		// 	totalEmployees = departamentPerEmployeeGroup.all().length;


		var tpl = uncomment(function() {/*
				<div class="row ">
					
				</div>
				
				<div class="row text-center" >
						<div class="departament-date col-md-12" />
						<ol class="breadcrumb date-filter">
							
						</ol>
					
    <button class="btn rollup-btn" style="display:none"><span class='glyphicon glyphicon-arrow-left'></span>Roll up</button>
				</div>
				<div class="row last-row">

						<div class="col-lg-3 col-md-4">
						  
		
								<div class="col-md-12 text-center">
									<img class="hospital-icon" src="imgs/hospital.svg" width="50%"/>
									<h3><small class="filter-value">--</small></h3>
								</div>
								
								<div class="col-md-6">	
									<div class="departament-total">-</div>
									<h4><small>Total</small></h4>
								</div>

								<div class="col-md-6 ">	
									<div class=" departament-avg">-</div>
									<h4><small>Average per FTE</small></h4>
								</div>
						</div>
					

					<div class="col-md-4 col-lg-3">						
						<div class="departament-per-group departament-pie text-center">

							<h5 class="text-center ">Per group</h5>

							<span class="h5">
							<small>
					          Current filter: <span class='default-value'>none</span><span class='filter'></span>	
					          </small>			          
					        </span>
				        </div>
							
						<span class="department-per-group-legend" />
					</div>
						
					<div class="col-md-4 col-lg-3">
						<div class="departament-per-employee departament-pie text-center">
							<h5 class="text-center">Per employee</h5>
							<span class="h5">
							<small>Current filter: <span class="default-value">none</span> <span class='filter'></span></small>			          
					        </span>
						</div>

						<span class="department-per-employee-legend" />
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

		var onFiltered = seq(makeRadioButton(), addDefaultFilterValue);

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
		    //     return d.value || '';
		    // })
 			.on('filtered', onFiltered)
		   

		

		d3.select(window).on('resize', redraw);

	    var updateStatistic =  function(rec) {
	  		var total = rec.crs.groupAll().reduceSum(dc.pluck('Examination')).value();
	  		totalEmployees = rec.perEmployeeGroup.all().length;
	  		totalTypes = rec.perGroupGroup.all().length;

	  		d3.select('.departament-avg')
	  			.html((total / totalEmployees).toFixed(2));

	  		d3.select('.departament-total')
	  			.html(total);

	  	};

	  	totalTypes = 0,
	  	totalEmployees = 0;
		yearChart = makeChart('.departament-date', service, {
		  rebindData: function(rec) {

		  perGroup.dimension(rec.perGroup)
		    	.group(rec.perGroupGroup)			    	
		    	.render()

		    perEmployee.dimension(rec.perEmployee)
		    	.group(rec.perEmployeeGroup)
		    	.render()

			// yearChart.redraw();
	  //     	if (perGroupFilter && !perGroupFilter.length) {
	  //          perGroupFilter = null;
	  //       }
	  //     	if (perGroupFilter && !perEmployeeFilter.length) {
	  //          perEmployeeFilter = null;
	  //       }
			// departamentperGroup.filter(perGroupFilter)
		 //    departamentPerEmployee.filter(perEmployeeFilter)

		   
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
		    	.radius(widthperGroup / 3)
			    .innerRadius(widthperGroup / 6)  
		    	 .legend(
		    	dc.htmlLegend()
		    	.container( perGroupLegendSvg )
		    	.x(0.3 * widthperGroup)
		    	// .y(widthperGroup)
		    	.itemHeight(legendItemHeight)
		    	.gap(legendGap)
		    	)
		
		     	

		   	perEmployee
	        .width(widthPerEmployee)
		    .height(heightPerEmployee)
		    .radius(widthPerEmployee / 3)
		    .innerRadius(widthPerEmployee / 6) 
		    .legend(dc.htmlLegend()
			    	.container(perEmployeeLegendSvg)
			    	.x(0.3 * widthPerEmployee)
			    	.y(0).itemHeight(legendItemHeight).gap(legendGap))


		   	yearChart.
		   		width(widthDate);

	    }

	    function getCurrentWidth() {
			return [
				parseInt(d3.select(el).select('.departament-per-group').style('width'), 10),
				parseInt(d3.select(el).select('.departament-per-employee').style('width'), 10),
				parseInt(d3.select(el).select('.departament-date').style('width'), 10),
			];
		}

		//Gets the data from the server and then redraw
		function render() {
			yearChart.render();
    	}

    	function redraw() {
    		updateChartsSizes();
    		dc.renderAll();
    	}
	});



	function drawResetButtons(el, self) {
		
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
				perGroup.render();
				perEmployee.render();
				drawResetButtons(el);
				yearChart.redraw();
			})

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
				perGroup.render();
				perEmployee.render();
				drawResetButtons(el);
				yearChart.redraw();
			})
	}

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

		drawResetButtons(chart.root().node(), this)
		
	}

	function seq(f1, f2) {
		return function(d, i) {
			f1(d, i);
			return f2(d, i);
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

	for (var type = 0; type < types.length; type++) {
		for (var employee = 0; employee < employees.length; employee++) {
			for (var year = 2008; year < 2008 + yearCount; year++) {
				for (var month = 1; month <= 12; month++) {
					for (var day = 1; day <= 31; day++) {
						data.push({
							'ExaminationTypeName': types[type],
							'Radiologist': employees[employee],
							'Year': year,
							'Month': month,
							'Day': day,
							'Examination': Math.floor(Math.random() * employees[employee].length)
						});
					}
				}
			}
		}
	}

	var reducer = function(by) {
		var init = {			
		};

		return [function(acc, next) {
			var key = next.ExaminationTypeName + '-' + next.Radiologist + '-' +  next[by];
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
				ExaminationTypeName: values[0],
				Radiologist: values[1],
				Examination: groups[key],
				value: values[2]
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

	function service(filter) {
		  d3.select('.waiting')
		  	.style('display', 'block')

      log(filter);

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
		          //    d.value = d.Month;
		          // });
	        } else 
	        {
	        	dataset = groupBy(data, 'Year');
	        	// dataset.forEach(function(d) {
		        //     d.value = d.Year;
		        // });		        
	        }
	        dataset.forEach(function(d) { d.value = +d.value;})
	        return dataset;
	    }).then(function(d) {
	    	d3.select('.waiting')
		  	.style('display', 'none')
		  	return d;
	    })

	          	
  	}
  	



    function log(d) {
      console.log(d);
    }



function makeChart(el, service, callback) {
    var filter = {}; //parameter to the query and to display

    var levels = ['year', 'month', 'week', 'day'] //, 'partOfDay']; // ->
    var currentLevel = 0;
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
      	left: 100,
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

    	
        // var mapFunc = !!beautifyAxis[levels[currentLevel]]? function(currentLevel, d) {
        //   return beautifyAxis[levels[currentLevel]][d];
        // }.bind(null, currentLevel): function(d) {         	
        // 	 return d;
        // };
        var crs = crossfilter(data),
            dimension = crs.dimension(function(d) { return d.value}),
            perGroup = crs.dimension(prop('ExaminationTypeName')),
            perEmployee = crs.dimension(prop('Radiologist')),
			perEmployeeGroup = perEmployee.group().reduceSum(dc.pluck('Examination')),

            perGroupGroup = perGroup.group().reduceSum(dc.pluck('Examination')),
            // pieDimension = crs.dimension(function(d) { return d.employee}),
            group = dimension.group().reduceSum(function(d) { return d.Examination});
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
        	return beautifyAxis[filterBy] && beautifyAxis[filterBy][d.key]? beautifyAxis[filterBy][d.key]: d.key;
        }) //rec.keyAccessor)

        self.dimension(rec.dimension)
        self.group(rec.group)
        self.x(d3.scale.ordinal().domain(rec.range))
        self.xUnits(dc.units.ordinal)


        //Some magic for old version
        // self.expireCache()
        // self.rescale();

        if (needRedraw) {
        	self.redraw();
        } else {
        	self.render();	
        }
        

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
        			
        			// debugger;
        			// redraw(self, true);
        		}
        		console.log(arguments);
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
        // console.log(currentLevel);
      

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