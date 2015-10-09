var result = [];

var types = ['CP', 'MR', 'RE', 'DT', 'VG'],
	employees = ['John', 'Bill', 'Max', 'Alex', 'David', 'Sasha'],
	yearCount = 10;

for (var type = 0; type < types.length; type++) {
	for (var employee = 0; employee < employees.length; employee++) {
		for (var year = 2008; year < 2008 + yearCount; year++) {
			for (var month = 1; month <= 12; month++) {
				for (var day = 1; day <= 31; day++) {
					result.push({
						'ExaminationTypeName': types[type],
						'Radiologist': employees[employee],
						'Year': year,
						'Month': month,
						'Day': day,
						'Examination': Math.floor(Math.random() * 20)
					});
				}
			}
		}
	}
}

console.log(result);