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
				<div class="row ">
								
					<div class="text-center">
						
						<div class="col-xs-4">	
							<div class="huge v-mid departament-total">100</div>
							
						</div>

						<div class="col-xs-4">
							<img src="factory.svg" />
							
						</div>
						
						<div class="col-xs-4">	
							<div class="huge v-mid departament-avg">5</div>
							
						</div>
					</div>	
				
				</div>

				<div class="row first-row">
								
					<div class="text-center">
						
						<div class="col-xs-4">	
							
							<h4>Total</h4>
						</div>

						<div class="col-xs-4">
							
							<h3>April, 2015</h3>	
						</div>
						
						<div class="col-xs-4">	
							
							<h4>Average per FTE</h4>
						</div>
					</div>	
				
				</div>

				<div class="row last-row">
					<div class="col-md-6 ">
						<h5 class="text-center section-title">Per type</h5>
						<div class="departament-per-type"></div>
					</div>
						
					<div class="col-md-6">
						<h5 class="text-center section-title">Per employee</h5>
						<div class="departament-per-employee"></div>
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

		var perType = dc.pieChart(d3.select(el).select('.departament-per-type').node())
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
		    .legend(dc.legend().x(0.3 * widthPerType).y(widthPerType).itemHeight(legendItemHeight).gap(legendGap))

		var perEmployee = dc.pieChart(d3.select(el).select('.departament-per-employee').node())

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
})();