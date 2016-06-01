var t, a, eff, discount; // indices
var cost0, cost1, cost2, cost3, pc, price, yield0, yield1, yield2, yield3, yield4; // user-set parameters
var treatedCDNR, treatedDNR, treatedNR, treatedYields = new Array(); // outcomes
var costs, pcFtnOfT, isProfitable = new Array(); // collation arrays

function the_table(age, efficacy, discount, cost0, cost1, cost2, cost3, pc, price, yield0, yield1, yield2, yield3, yield4) {
	d3.tsv("yield-rates.tsv", function(data) {

		var healthyACDNBna, acdnb25y3, acdnb25y5, acdnb25y10, acdnb50y3, acdnb50y5, acdnb50y10, acdnb75y3, acdnb75y5, acdnb75y10, treatedYields, treatedNR, treatedDNR, treatedCDNR, ccthv = new Array();
		var bea = {
			'healthy' : null,
			'untreated' : null,
			'25y3' : 0,
			'50y3' : 0,
			'75y3' : 0,
			'25y5' : 0,
			'50y5' : 0,
			'75y5' : 0,
			'25y10' : 0,
			'50y10' : 0,
			'75y10' : 0			
		};

		var lpy = {
			'healthy' : null,
			'untreated' : null,
			'25y3' : 0,
			'50y3' : 0,
			'75y3' : 0,
			'25y5' : 0,
			'50y5' : 0,
			'75y5' : 0,
			'25y10' : 0,
			'50y10' : 0,
			'75y10' : 0			
		};

		var bep = {
			'healthy' : 0,
			'untreated' : 1,
			'25y3' : 0,
			'50y3' : 0,
			'75y3' : 0,
			'25y5' : 0,
			'50y5' : 0,
			'75y5' : 0,
			'25y10' : 0,
			'50y10' : 0,
			'75y10' : 0			
		};

		var scenarios = {
			'healthy' : 'Healthy, untreated',
			'untreated' : 'Infected, untreated',
			'25y3' : '25% DCE treatment adopted year 3',
			'50y3' : '50% DCE treatment adopted year 3',
			'75y3' : '75% DCE treatment adopted year 3',
			'25y5' : '25% DCE treatment adopted year 5',
			'50y5' : '50% DCE treatment adopted year 5',
			'75y5' : '75% DCE treatment adopted year 5',
			'25y10' : '25% DCE treatment adopted year 10',
			'50y10' : '50% DCE treatment adopted year 10',
			'75y10' : '75% DCE treatment adopted year 10'
		};

		var scenarioKeys = Object.keys(scenarios);

		var discountFactor = 1/(1+discount/100);

		healthyYields = [
			yield0,
			yield1,
			yield2,
			yield3,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,
			yield4,		
			yield4		
		];

		untreatedYields = [];
		for (var i in healthyYields) {
			untreatedYields[i] = healthyYields[i]*data[i]['noAction']/100;
		}

		costs = [
			cost0,
			cost1,
			cost2,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3,
			cost3			
		];

		var pcFtnOfT = [];
		for (var l=0; l<age; l++) {
			pcFtnOfT[l] = 0;
		};
		for (var l=age; l<26; l++) {
			pcFtnOfT[l] = pc;
		};

		var healthyNR = [];
		for (var i in healthyYields) {
			healthyNR[i] = price*healthyYields[i]-costs[i]-pcFtnOfT[i];
		};

		var untreatedNR = [];
		for (var i in untreatedYields) {
			untreatedNR[i] = price*untreatedYields[i]-costs[i];
		};	

		var healthyDNR = [];
		for (var i in healthyNR) {
			var compoundDiscount = Math.pow(discountFactor, i);
			healthyDNR[i] = healthyNR[i]*compoundDiscount;
		};

		var untreatedDNR = [];
		for (var i in untreatedNR) {
			var compoundDiscount = Math.pow(discountFactor, i);
			untreatedDNR[i] = untreatedNR[i]*compoundDiscount;
		};	

		var healthyCDNR = [ healthyDNR[0] ];
		for (var i=1; i<healthyDNR.length; i++) {
			healthyCDNR[i] = healthyDNR[i] + healthyCDNR[i-1];
		};

		var untreatedCDNR = [ untreatedDNR[0] ];
		for (var i=1; i<untreatedDNR.length; i++) {
			untreatedCDNR[i] = untreatedDNR[i] + untreatedCDNR[i-1];
		};

 		var healthyCDNRna = [ price*healthyYields[0] - costs[0] ];
 		for (var i=1; i<healthyYields.length; i++) {
 			var compoundDiscount = Math.pow(discountFactor, i);
 			healthyCDNRna[i] = (price*healthyYields[i] - costs[i])*compoundDiscount + healthyCDNR[i-1];
 		};

 		healthyACDNBna = [];
 		for (var i in healthyCDNRna) {
 			healthyACDNBna[i] = healthyCDNRna[i] - untreatedCDNR[i];
 		};

 		for (var a=2; a<scenarioKeys.length; a++) {

			var selectCol = scenarioKeys[a];

			treatedYields = [];
			for (var i in healthyYields) {
				treatedYields[i] = healthyYields[i]*data[i][selectCol]/100;
			};

			treatedNR = [];
			for (var i in treatedYields) {
				treatedNR[i] = price*treatedYields[i]-costs[i]-pcFtnOfT[i];
			};

			treatedDNR = [];
			for (var i in treatedNR) {
				var compoundDiscount = Math.pow(discountFactor, i);
				treatedDNR[i] = treatedNR[i]*compoundDiscount;
			};

			treatedCDNR = [ treatedDNR[0] ];
			for (var i=1; i<treatedDNR.length; i++) {
				treatedCDNR[i] = treatedDNR[i] + treatedCDNR[i-1];
			};

			ccthv = [ parseInt(pcFtnOfT[0]) ];
			for (var i=1; i<healthyDNR.length; i++) {
				ccthv[i] = parseInt(pcFtnOfT[i]) + parseInt(ccthv[i-1]);
			};

			var acdnb = [];
			for (var i in treatedCDNR) {
				acdnb[i] = treatedCDNR[i] - untreatedCDNR[i];
	 		};

	 		switch (selectCol) {
	 			case '25y3':
	 				acdnb25y3 = acdnb;
	 				break;
	 			case '25y5':
	 				acdnb25y5 = acdnb;
	 				break;
	 			case '25y10':
	 				acdnb25y10 = acdnb;
	 				break;
	 			case '50y3':
	 				acdnb50y3 = acdnb;
	 				break;
	 			case '50y5':
	 				acdnb50y5 = acdnb;
	 				break;
	 			case '50y10':
	 				acdnb50y10 = acdnb;
	 				break;
	 			case '75y3':
	 				acdnb75y3 = acdnb;
	 				break;
	 			case '75y5':
	 				acdnb75y5 = acdnb;
	 				break;
	 			case '75y10':
	 				acdnb75y10 = acdnb;
	 				break;
	 		}

	 		for (var i in treatedCDNR) {
	 			if (treatedCDNR[i] > untreatedCDNR[i]) {
	 				bea[selectCol] = i;
	 				break;
	 			};
	 		};
	 		if (bea[selectCol]==0 && treatedCDNR[0] <= untreatedCDNR[0]) {
	 			bea[selectCol] = 'Never breaks even';
	 		};

	 		lpy[selectCol] = selectCol.substr(3);
	 		while (treatedNR[parseInt(lpy[selectCol])+1] <= 0 && parseInt(lpy[selectCol])<25) {
	 			lpy[selectCol]++;
	 		}
	 		if (parseInt(lpy[selectCol])==25) {
	 			lpy[selectCol] = 'Treatment never profitable';
	 		} else {
		 		while (treatedNR[parseInt(lpy[selectCol])+1] > 0 && parseInt(lpy[selectCol])<25) {
		 			lpy[selectCol]++;
		 		}
		 	}

	 		bep[selectCol] = (healthyCDNRna[25] - healthyCDNR[25]) / ( (treatedCDNR[25] - healthyCDNR[25]) - (untreatedCDNR[25] - healthyCDNRna[25]) );
	 		if (bep[selectCol] > 1)
	 			bep[selectCol] = 1;

	 	};

		var the_table_html = '<table><thead><th>Age</th><th>Infected, untreated CDNB</th><th>Healthy, untreated ACDNB</th><th>25% DCE year 3 ADCNB</th><th>50% DCE year 3 ADCNB</th><th>75% DCE year 3 ADCNB</th><th>25% DCE year 5 ADCNB</th><th>50% DCE year 5 ADCNB</th><th>75% DCE year 5 ADCNB</th><th>25% DCE year 10 ADCNB</th><th>50% DCE year 10 ADCNB</th><th>75% DCE year 10 ADCNB</th></thead><tbody>';

		the_table_html += '<tr><td>Breakeven age</td><td></td><td></td>';
		for (var i=2; i<scenarioKeys.length; i++) {
			the_table_html += '<td>' + bea[scenarioKeys[i]] + '</td>';
		};
		the_table_html += '</tr>';

		the_table_html += '<tr><td>Last profitable year</td><td></td><td></td>';
		for (var i=2; i<scenarioKeys.length; i++) {
			the_table_html += '<td>' + lpy[scenarioKeys[i]] + '</td>';
		};
		the_table_html += '</tr>';

		the_table_html += '<tr><td>Breakeven probability</td>';
		for (var i=0; i<scenarioKeys.length; i++) {
			the_table_html += '<td>' + bep[scenarioKeys[i]] + '</td>';
		};
		the_table_html += '</tr>';

		for (var k=0; k<26; k++) {
			the_table_html += '<tr><td>' + k + '</td><td>' + untreatedCDNR[k] + '</td><td>' + healthyACDNBna[k] + '</td><td>' + acdnb25y3[k] + '</td><td>' + acdnb50y3[k] + '</td><td>' + acdnb75y3[k] + '</td><td>' + acdnb25y5[k] + '</td><td>' + acdnb50y5[k] + '</td><td>' + acdnb75y5[k] + '</td><td>' + acdnb25y10[k] + '</td><td>' + acdnb50y10[k] + '</td><td>' + acdnb75y10[k] + '</td></tr>';
		}

		the_table_html += '</tbody></table>';
		$('.results').html(the_table_html);
	});
};