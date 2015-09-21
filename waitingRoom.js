(function() {
	widgetRegister.register("Waiting Room", function(el, data, general, config) {

	var tpl = uncomment(function(){/*
<div class="row waiting-room">
			<div class="col-md-6 clock text-center">								
				<span>12:34</span>
			</div>
				
			<div class="col-md-6">
				<div class="row no-gutter">
					<div class="col-sm-4">
						<table class="table table-bordered">
							<thead class="ct-head">
								<tr>
									<th  colspan="2">CT</th>
								</tr>
							</thead>
							<tbody class="ct">
								<tr>
									<td>1</td>
									<td>100</td>
								</tr>
								<tr>
									<td>2</td>
									<td>101</td>
								</tr>
								<tr>
									<td>3</td>
									<td>101</td>
								</tr>
								<tr>
									<td>4</td>
									<td>400</td>
								</tr>
								<tr>
									<td>5</td>
									<td>101</td>
								</tr>
							</tbody>
						</table>
					</div>


					<div class="col-sm-4">
						<table class="table table-bordered">
							<thead class="buddy-head">
								<tr >
									<th colspan="2">Buddy</th>
								</tr>
							</thead>
							<tbody class="buddy">
								<tr>
									<td>1</td>
									<td>100</td>
								</tr>
								<tr>
									<td>2</td>
									<td>101</td>
								</tr>
								<tr>
									<td>3</td>
									<td>101</td>
								</tr>
								<tr>
									<td>4</td>
									<td>400</td>
								</tr>
								<tr>
									<td>5</td>
									<td>101</td>
								</tr>
							</tbody>
						</table>
					</div>


					<div class="col-sm-4">
						<table class="table table-bordered">
							<thead class="mr-head">
								<tr>
									<th colspan="2">MR</th>
								</tr>
							</thead>
							<tbody class="mr">
								<tr>
									<td>1</td>
									<td>100</td>
								</tr>
								<tr>
									<td>2</td>
									<td>432</td>
								</tr>
								<tr>
									<td>3</td>
									<td>101</td>
								</tr>
								<tr>
									<td>4</td>
									<td>400</td>
								</tr>
								<tr>
									<td>5</td>
									<td>101</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>

		<div class="row">
			<div class="col-md-4">
				<div class="panel panel-default">
					<div class="panel-heading ct-head">CT</div>
					<div class="panel-body">
						<img src="speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>				
				
			</div>
			<div class="col-md-4">
				<div class="panel panel-default">
					<div class="panel-heading buddy-head">Buddy</div>
					<div class="panel-body">
						<img src="speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>	
			</div>
			<div class="col-md-4">
				<div class="panel panel-default">
					<div class="panel-heading mr-head">MR</div>
					<div class="panel-body">
						<img src="speedo.svg" width="100%" height="100%"/>
						<h4 class="text-center">-5 min</h4>
					</div>
				</div>	
			</div>
		</div>

	*/})

		d3.select(el)
			.html(tpl);
	});


	function uncomment(fn){
		var str = fn.toString();
	  return str.slice(str.indexOf('/*') + 2, str.indexOf('*/'));
	};

})()