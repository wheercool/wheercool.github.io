(function() {

	widgetRegister.register("Departament Insight", function(el, data, config) {
	    
		var departament = crossfilter(departamentInsight),
		    all = departament.groupAll(),
		    departamentPerType = departament.dimension(prop('ExaminationTypeName')),
		    departamentPerTypeGroup = departamentPerType.group(),
		    departamentPerEmployee = departament.dimension(prop('Radiologist')),
		    departamentPerEmployeeGroup = departamentPerEmployee.group(),
		    averageEmployee = departament.dimension(prop('Radiologist')),
		    averageEmployeeGroup = departamentPerEmployee.groupAll();
		    
		
		var tpl = uncomment(function() {/*
				<div class="row">
									
					<div class="text-center">
						<div>
							<h3>April, 2015</h3>
							<h4>Total examinations: <span class="text-right">100</span></h4>
							<h4>Examinations per FTE: 5</h4>
						</div>
					</div>	
				
				</div>

				<div class="row">
					<div class="col-md-6 panel panel-default">
						<h5 class="text-center">Examinations per type</h5>
						<div class="departament-per-type"></div>
					</div>
						
					<div class="col-md-6 panel panel-default">
						<h5 class="text-center">Examinations per employee</h5>
						<div class="departament-per-employee"></div>
					</div>
				</div>*/});

		d3.select(el)
			.html(tpl);

		var ws = getCurrentWidth();
			widthPerType = ws[0],
			widthPerEmployee = ws[1];
 


		var perType = dc.pieChart(d3.select(el).select('.departament-per-type'))
		    .width(widthPerType)
		    .height(widthPerType)
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
		    .legend(dc.legend().x(0.3 * widthPerType).y(6/7 * widthPerType).itemHeight(13).gap(5))

		 debugger;

		var perEmployee = dc.pieChart(d3.select(el).select('.departament-per-employee'))
		    .width(widthPerEmployee)
		    .height(widthPerEmployee)
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


		    .legend(dc.legend().x(0.3 * widthPerEmployee).y(6/7 * widthPerEmployee).itemHeight(13).gap(5))


		
			d3.select(window).on('resize', function() {
			    var ws = getCurrentWidth();
				widthPerType = ws[0],
				widthPerEmployee = ws[1];

			    perType
			        .width(widthPerType)
			        .height(widthPerType)
			        .radius(widthPerType / 3)
			        .innerRadius(widthPerType / 6)   
			        .legend(dc.legend().x(0.3 * widthPerType).y(6/7 * widthPerType).itemHeight(13).gap(5))

			    perEmployee
			        .width(widthPerEmployee)
			        .height(widthPerEmployee)
			        .radius(widthPerEmployee / 3)
			        .innerRadius(widthPerEmployee / 6)   
			        .legend(dc.legend().x(0.3 * widthPerEmployee).y(6/7 * widthPerEmployee).itemHeight(13).gap(5))

			});

	    return {
	    	render: {
	    		perType.render();
	    		perEmployee.render();
	    	}
	    }
	});


	function prop(nm) {
	    return function(obj) {
	        return obj[nm];
	    };
	}

	function getCurrentWidth() {
		return [
			parseInt(d3.select(el).select('.departament-per-type').style('width'), 10),
			parseInt(d3.select(el).select('.departament-per-employee').style('width'), 10)
		];
	}

	function uncomment(fn){
	  return fn.toString().split(/\/\*\n|\n\*\//g).slice(1,-1).join();
	};
})();