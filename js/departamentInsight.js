(function() {

	widgetRegister.register("Department Insight", function(el, data, general, config) {
	    
	   	/* Default settings */
	   	var legendItemHeight = 13,
	   		legendGap = 5;

		var departament = crossfilter(data),
		    all = departament.groupAll(),
		    departamentPerType = departament.dimension(prop('ExaminationTypeName')),
		    departamentPerTypeGroup = departamentPerType.group(),
		    departamentPerEmployee = departament.dimension(prop('Radiologist')),
		    departamentPerEmployeeGroup = departamentPerEmployee.group(),
		    averageEmployee = departament.dimension(prop('Radiologist')),
		    averageEmployeeGroup = departamentPerEmployee.groupAll();
		    
		
		var totalTypes = departamentPerTypeGroup.all().length,
			totalEmployees = departamentPerEmployeeGroup.all().length;


		var tpl = uncomment(function() {/*
				<div class="row text-center">
								
						
						<div class="col-xs-41">	
							<div class="huge departament-total">100</div>
							<h4><small>Total</small></h4>
						</div>

						<div class="col-xs-41">
							<img class="hospital-icon" src="imgs/hospital.svg" width="90%"/>
							<h3><small>April, 2015</small></h3>
						</div>
						
						<div class="col-xs-41">	
							<div class="huge departament-avg">5</div>
							<h4><small>Average per FTE</small></h4>
						</div>
					
				
				</div>

				

				<div class="row last-row">
					<div class="col-md-6 ">						
						<div class="departament-per-type departament-pie text-center">

							<h5 class="text-center ">Per type</h5>

							<span class="h5">
							<small>
					          Current filter: <span class='default-value'>none</span><span class='filter'></span>	
					          </small>			          
					        </span>
				        </div>
							
						<span class="department-per-type-legend" />
					</div>
						
					<div class="col-md-6">
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

		var ws = getCurrentWidth();
			widthPerType = ws[0],
			widthPerEmployee = ws[1],
			legendHeightType = totalTypes * (legendItemHeight + legendGap),
			// heightPerType = widthPerType + legendHeightType,
			heightPerType = widthPerType,
			legendHeigthEmployee = totalEmployees * (legendItemHeight + legendGap),
			// heightPerEmployee = widthPerEmployee + legendHeigthEmployee;
			heightPerEmployee = widthPerEmployee;



		d3.select(el).select('.departament-total').text(config.total)
		d3.select(el).select('.departament-avg').text(config.avg)
		var onFiltered = seq(makeRadioButton(), addDefaultFilterValue);

		var perTypeLegendSvg = d3.select('.department-per-type-legend').append('svg');
		var perEmployeeLegendSvg = d3.select('.department-per-employee-legend').append('svg');

		var perTypeSlices = config.perType? (config.perType.maxSlices || 20): 20;
		var perEmployeeSlices = config.perEmployee? (config.perEmployee.maxSlices || 20): 20;
		var perTypeColorPalette = config.perType? (config.perType.colorPalette || d3.scale.category20c().range()): d3.scale.category20c().range();
		var perEmployeeColorPalette = config.perEmployee? (config.perEmployee.colorPalette || d3.scale.category20b().range()): d3.scale.category20b().range();
		perType = dc.pieChart(d3.select(el).select('.departament-per-type.departament-pie').node())
		    .width(widthPerType)
		    .height(heightPerType)
		    .dimension(departamentPerType)
		    .group(departamentPerTypeGroup)
		    .minAngleForLabel(0.5)
		    .radius(widthPerType / 3)
		    .slicesCap(perTypeSlices)
		    .innerRadius(widthPerType / 6)   
		    .colors(d3.scale.ordinal().range(perTypeColorPalette))
		    .label(function(d) {
		        var names = d.key.split(' ');
		        // return names[0][0] + '. ' + names[1][0] + '.';
		        return d.value || '';
		    }) 
		    .on('filtered', onFiltered)
		    .legend(
		    	dc.htmlLegend()
		    	.container( perTypeLegendSvg )
		    	.x(0.3 * widthPerType)
		    	// .y(widthPerType)
		    	.itemHeight(legendItemHeight)
		    	.gap(legendGap)
		    	)
		

		   
		   perTypeLegendSvg.attr('height', legendHeightType);

			perEmployee = dc.pieChart(d3.select(el).select('.departament-per-employee').node())

		    .width(widthPerEmployee)
		    .height(heightPerEmployee)
		    .radius(widthPerEmployee / 3)
		    .slicesCap(perEmployeeSlices)
		    .minAngleForLabel(0.5)
		    .innerRadius(widthPerEmployee / 6)  
		    .colors(d3.scale.ordinal().range(perEmployeeColorPalette))
		    //.renderLabel(false)
		    .label(function(d) {
		        var names = d.key.split(' ');
		        // return names[0][0] + '. ' + names[1][0] + '.';
		        return d.value || '';
		    })
		    .dimension(departamentPerEmployee)
		    .group(departamentPerEmployeeGroup)
 			.on('filtered', onFiltered)
		    .legend(dc.htmlLegend()
		    	.container(perEmployeeLegendSvg)
		    	.x(0.3 * widthPerEmployee)
		    	.y(0).itemHeight(legendItemHeight).gap(legendGap))

		
		   perEmployeeLegendSvg.attr('height', legendHeigthEmployee);

			d3.select(window).on('resize', function() {
			    var ws = getCurrentWidth();
					widthPerType = ws[0],
					widthPerEmployee = ws[1],
					legendHeightType = totalTypes * (legendItemHeight + legendGap),
					// heightPerType = widthPerType + legendHeightType,
					heightPerType = widthPerType,
					legendHeigthEmployee = totalEmployees * (legendItemHeight + legendGap),
					// heightPerEmployee = widthPerEmployee + legendHeigthEmployee;
					heightPerEmployee = widthPerEmployee;

			    perType
			        .width(widthPerType)
			        .height(heightPerType)
			        .radius(widthPerType / 3)
			        .innerRadius(widthPerType / 6)   
			        // .legend(
			        // 	dc.legend()
			        // 	.x(0.3 * widthPerType).y(widthPerType).itemHeight(legendItemHeight).gap(legendGap))

			    perEmployee
			        .width(widthPerEmployee)
			        .height(heightPerEmployee)
			        .radius(widthPerEmployee / 3)
			        .innerRadius(widthPerEmployee / 6)   
			        // .legend(dc.legend().x(0.3 * widthPerEmployee).y(widthPerEmployee).itemHeight(legendItemHeight).gap(legendGap))

			    render();

			});

		

		render();

	    return {
    		render: render
	    };


	    function getCurrentWidth() {
			return [
				parseInt(d3.select(el).select('.departament-per-type').style('width'), 10),
				parseInt(d3.select(el).select('.departament-per-employee').style('width'), 10)
			];
		}

		function render() {
    		perType.render();

    		perEmployee.render();


    		// console.log(d3.select(el).select('.departament-per-employee svg').append("g").classed('reset', true))
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
				render();
			})

			d3.select(el).select('.departament-per-type svg')
			.append('text')
			.classed('reset', true)
			.style('display', function() { return perType.hasFilter() ? 'block': 'none';  })
			.attr('x', widthPerType / 2)
			.attr('y', heightPerType / 2)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.attr('font-size', 16)
			.attr('font-weight', 'bold')
			.attr('fill', '#066784')
			.attr('cursor', 'pointer')
			.text('reset')
			.on('click', function() {
				perType.filterAll();
				render();
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


})();