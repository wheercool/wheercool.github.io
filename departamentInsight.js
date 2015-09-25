(function() {

	widgetRegister.register("Departament Insight", function(el, data, general, config) {
	    
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
							<img src="imgs/hospital.svg" width="90%"/>
							<h3><small>April, 2015</small></h3>
						</div>
						
						<div class="col-xs-41">	
							<div class="huge departament-avg">5</div>
							<h4><small>Average per FTE</small></h4>
						</div>
					
				
				</div>

				

				<div class="row last-row">
					<div class="col-md-6 ">						
						<div class="departament-per-type departament-pie">

						<h5 class="text-center ">Per type <a class='reset'
          href='javascript:perType.filterAll();dc.redrawAll();'
          style='display: none;'>reset</a></h5>

						<span class="h6">
				          Current filter: <span class='default-value'>none</span><span class='filter'></span>				          
				        </span>
				        </div>
							
						
					</div>
						
					<div class="col-md-6">
						<div class="departament-per-employee departament-pie">
						<h5 class="text-center">Per employee
							<a class='reset'
					          href='javascript:perEmployee.filterAll();dc.redrawAll();'
					          style='display: none;'>reset</a>
						</h5>
						<span class="h6">
				          Current filter: <span class="default-value">none</span> <span class='filter'></span>				          
				        </span>

						</div>
					</div>
				</div>*/});
		// document.write('TPL');
		// document.write(tpl);
		d3.select(el)
			.html(tpl);

		var ws = getCurrentWidth();
			widthPerType = ws[0],
			widthPerEmployee = ws[1],
			legendHeightType = totalTypes * (legendItemHeight + legendGap),
			heightPerType = widthPerType + legendHeightType,
			legendHeigthEmployee = totalEmployees * (legendItemHeight + legendGap),
			heightPerEmployee = widthPerEmployee + legendHeigthEmployee;


		d3.select(el).select('.departament-total').text(general.total)
		d3.select(el).select('.departament-avg').text(general.avg)
		var onFiltered = seq(makeRadioButton(), addDefaultFilterValue);


		perType = dc.pieChart(d3.select(el).select('.departament-per-type').node())
		    .width(widthPerType)
		    .height(heightPerType)
		    .dimension(departamentPerType)
		    .group(departamentPerTypeGroup)
		    .minAngleForLabel(0.5)
		    .radius(widthPerType / 3)
		    .slicesCap(20)
		    .innerRadius(widthPerType / 6)   
		    .label(function(d) {
		        var names = d.key.split(' ');
		        // return names[0][0] + '. ' + names[1][0] + '.';
		        return d.value || '';
		    }) 
		    .on('filtered', onFiltered)
		    .legend(dc.legend().x(0.3 * widthPerType).y(widthPerType).itemHeight(legendItemHeight).gap(legendGap))
		    
		    
		perEmployee = dc.pieChart(d3.select(el).select('.departament-per-employee').node())

		    .width(widthPerEmployee)
		    .height(heightPerEmployee)
		    .radius(widthPerEmployee / 3)
		    .slicesCap(20)
		    .minAngleForLabel(0.5)
		    .innerRadius(widthPerEmployee / 6)  
		    .colors(d3.scale.category20b())
		    //.renderLabel(false)
		    .label(function(d) {
		        var names = d.key.split(' ');
		        // return names[0][0] + '. ' + names[1][0] + '.';
		        return d.value || '';
		    })
		    .dimension(departamentPerEmployee)
		    .group(departamentPerEmployeeGroup)
 			.on('filtered', onFiltered)
		    .legend(dc.legend().x(0.3 * widthPerEmployee).y(widthPerEmployee).itemHeight(legendItemHeight).gap(legendGap))

		
			d3.select(window).on('resize', function() {
			    var ws = getCurrentWidth();
					widthPerType = ws[0],
					widthPerEmployee = ws[1],
					legendHeightType = totalTypes * (legendItemHeight + legendGap),
					heightPerType = widthPerType + legendHeightType,
					legendHeigthEmployee = totalEmployees * (legendItemHeight + legendGap),
					heightPerEmployee = widthPerEmployee + legendHeigthEmployee;

			    perType
			        .width(widthPerType)
			        .height(heightPerType)
			        .radius(widthPerType / 3)
			        .innerRadius(widthPerType / 6)   
			        .legend(dc.legend().x(0.3 * widthPerType).y(widthPerType).itemHeight(legendItemHeight).gap(legendGap))

			    perEmployee
			        .width(widthPerEmployee)
			        .height(heightPerEmployee)
			        .radius(widthPerEmployee / 3)
			        .innerRadius(widthPerEmployee / 6)   
			        .legend(dc.legend().x(0.3 * widthPerEmployee).y(widthPerEmployee).itemHeight(legendItemHeight).gap(legendGap))

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