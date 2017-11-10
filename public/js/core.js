// public/core.js
angular.module('weathercast', ['histController', 'histService', 'weatherService','angularMoment']);

angular.module('weathercast')
	.config(['darkSkyProvider', function(darkSkyProvider) {
	darkSkyProvider.setApiKey('3e8acf4ec48ec55a15d359f5ad048dc0');
}])
	.directive("linkChart", function(moment, $window, $timeout) {
	    //explicitly creating a directive definition variable
	    //this may look verbose but is good for clarification purposes
	    //in real life you'd want to simply return the object {...}
	    var directiveDefinitionObject = {
	      //We restrict its use to an element
	      //as usually  <bars-chart> is semantically
	      //more understandable
	      restrict: "E",
	      //this is important,
	      //we don't want to overwrite our directive declaration
	      //in the HTML mark-up
	      replace: false,
	      //our data source would be an array
	      //passed thru chart-data attribute
	      scope: { data: "=chartData" },
	      link: function(scope, element, attrs) {
      		//in D3, any selection[0] contains the group
      		//selection[0][0] is the DOM node
      		//but we won't need that this time
      		var renderTimeout;

      		// var parseTime = d3.timeParse("%s");
      		// Browser onresize event
      		$window.onresize = function() {
      		  scope.$apply();
      		};
      		
      		// Watch for resize event
      		scope.$watch(function() {
      		  return angular.element($window)[0].innerWidth;
      		}, function() {
      		  scope.render(scope.data);
      		});

      		scope.$watch('data', function(newData) {
      		  scope.render(newData);
      		}, true);
      		
      		scope.render = function(data) {   
      		  if (!data) return;
      		  if (renderTimeout) clearTimeout(renderTimeout);
      		  // console.log(width , height);

      		  renderTimeout = $timeout(function() {
	      		  d3.select("#svg0").remove();
	      		  var pWidth = document.getElementById('line-chart-view').offsetWidth;
	      		  var margin = {top: 20, right: 20, bottom: 50, left: 40},
	      		      width = pWidth - margin.left - margin.right,
	      		      height = 180 - margin.top - margin.bottom;

	      		  var svg = d3.select(element[0])
	      		    .append('svg')
	      		    .attr("id", "svg0")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform",
					    "translate(" + margin.left + "," + margin.top + ")");
	       		    var x = d3.scaleTime().rangeRound([0, width]);
	       		    var y = d3.scaleLinear().rangeRound([height, 0]);

	       		    var valueline = d3.line()
	       		        .x(function(d) { return x(new Date(d.time * 1000)); })
	       		        .y(function(d) { return y(d.temperature); });
	       			x.domain(d3.extent(data, function(d) {return new Date(d.time * 1000)}));
	       			var yRange = d3.extent(data, function(d) { return d.temperature; });
	       			yRange[0] -= 5;
	       			yRange[1] += 5;
	       		    y.domain(yRange);

	 				 svg.append("path")
	 				     .data([data])
	 				     .attr("fill", "none")
	 				     .attr("stroke", "steelblue")
	 				     .attr("stroke-width", 1.5)
	 				     .attr("class", "line")
	 				     .attr("d", valueline);

	 				 // Add the x Axis
	 				 svg.append("g")
	 				     .attr("transform", "translate(0," + height + ")")
	 				     .call(d3.axisBottom(x).ticks(5));

	 				 // text label for the x axis
	 				 svg.append("text")             
	 				     .attr("transform",
	 				           "translate(" + (width/2) + " ," + 
	 				                          (height + margin.top + 20) + ")")
	 				     .style("text-anchor", "end")
	 				     .attr("fill", "#000")
	 				     .text("Local Time");

	 				 // Add the y Axis
	 				 svg.append("g")
	 				     .call(d3.axisLeft(y).ticks(7));

	 				 // text label for the y axis
	 				 svg.append("text")
						.attr("fill", "#000")
						.attr("transform", "rotate(-90)")
						.attr("y", 0 - margin.left)

						.attr("dy", "1em")
						.attr("text-anchor", "end")
						.text("Temperature"); 
					yesterday = new Date(data[0].time * 1000);

					
					svg.append("text")
					        .attr("x", (width / 2))             
					        .attr("y", 0 - (margin.top / 3))
					        .attr("text-anchor", "middle")  
					        .text("Temperature yesterday (" + yesterday.getMonth() + "/"+ yesterday.getDate()+  ")")
					        .style("font-weight", "bold");
      		  }, 200);

	      	}
	      }
	    };
	    return directiveDefinitionObject;
	  })
		.directive("linkChartWeekly", function(moment, $window, $timeout) {
		    //explicitly creating a directive definition variable
		    //this may look verbose but is good for clarification purposes
		    //in real life you'd want to simply return the object {...}
		    var directiveDefinitionObject = {
		      //We restrict its use to an element
		      //as usually  <bars-chart> is semantically
		      //more understandable
		      restrict: "E",
		      //this is important,
		      //we don't want to overwrite our directive declaration
		      //in the HTML mark-up
		      replace: false,
		      //our data source would be an array
		      //passed thru chart-data attribute
		      scope: { data: "=chartData" },
		      link: function(scope, element, attrs) {
	      		//in D3, any selection[0] contains the group
	      		//selection[0][0] is the DOM node
	      		//but we won't need that this time
	      		var renderTimeout;

	      		// var parseTime = d3.timeParse("%s");
	      		// Browser onresize event
	      		$window.onresize = function() {
	      		  scope.$apply();
	      		};
	      		
	      		// Watch for resize event
	      		scope.$watch(function() {
	      		  return angular.element($window)[0].innerWidth;
	      		}, function() {
	      		  scope.render(scope.data);
	      		});

	      		scope.$watch('data', function(newData) {
	      		  scope.render(newData);
	      		}, true);
	      		
	      		scope.render = function(data) { 
	      		  if (!data) return;
	      		  if (renderTimeout) clearTimeout(renderTimeout);
	      		  renderTimeout = $timeout(function() {

		      		  var pWidth = document.getElementById('line-chart-weekly-view').offsetWidth;
		      		  var margin = {top: 20, right: 5, bottom: 50, left: 40},
		      		      width = pWidth - margin.left - margin.right,
		      		      height = 180 - margin.top - margin.bottom;
		      		  d3.select("#svg1").remove();
		      		  var svg = d3.select(element[0])
		      		    .append('svg')
		      		    .attr("id", "svg1")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform",
						    "translate(" + margin.left + "," + margin.top + ")");
		       		    var x = d3.scaleTime().rangeRound([0, width]);
		       		    var y = d3.scaleLinear().rangeRound([height, 0]);

		       		    var valueline = d3.line()
		       		        .x(function(d) { return x(new Date(d.time * 1000)); })
		       		        .y(function(d) { return y(d.temperatureHigh); });
		       		    var valueline2 = d3.line()
		       		        .x(function(d) { return x(new Date(d.time * 1000)); })
		       		        .y(function(d) { return y(d.temperatureLow); });
		       		    var xD = [d3.min(data, function(d) {return new Date((d.time - 12*60*60)  * 1000)}),
	       		        	d3.max(data, function(d) {return new Date(d.time * 1000)})];
		       			x.domain(xD);
		       			var yRange = [d3.min(data, function(d) {return d.temperatureLow}), 
		       		    	d3.max(data, function(d) {return d.temperatureHigh})];

		       		    yRange[0] -= 5;
		       		    yRange[1] += 5;

		       		    y.domain(yRange);
		       		    // if (data) {
		       		    // 	var meanHigh = d3.mean(data, function(d) {return d.temperatureHigh});
		       		    // 	var meanLow = d3.mean(data, function(d) {return d.temperatureLow});

		       		    // 	svg.append("line")          // attach a line
		       		    // 	    .style("stroke", "ffc2c2")  // colour the line
		       		    // 	    .attr("x1", 0)     // x position of the first end of the line
		       		    // 	    .attr("y1", y(meanHigh))      // y position of the first end of the line
		       		    // 	    .attr("x2", width)     // x position of the second end of the line
		       		    // 	    .attr("y2", y(meanHigh));    // y position of the second end of the line

		       		    // 	svg.append("line")          // attach a line
		       		    // 	    .style("stroke", "c2dcff")  // colour the line
		       		    // 	    .attr("x1", 0)     // x position of the first end of the line
		       		    // 	    .attr("y1", y(meanLow))      // y position of the first end of the line
		       		    // 	    .attr("x2", width)     // x position of the second end of the line
		       		    // 	    .attr("y2", y(meanLow));    // y position of the second end of the line
		       		    	   

		       		    // }

		 				 // Add the x Axis
		 				 svg.append("g")
		 				     .attr("transform", "translate(0," + height + ")")
		 				     .call(d3.axisBottom(x).ticks(4));

		 				 svg.selectAll("dot")
		 				     .data(data)
		 				   .enter().append("circle")
		 				     .attr("r", 3.5)
		 				     .attr("cx", function(d) { return x(new Date(d.time * 1000)); })
		 				     .attr("cy", function(d) { return y(d.temperatureHigh); })
		 				     .style("fill", "red");

		 				 svg.selectAll("dot")
		 				     .data(data)
		 				   .enter().append("circle")
		 				     .attr("r", 3.5)
		 				     .attr("cx", function(d) { return x(new Date(d.time * 1000)); })
		 				     .attr("cy", function(d) { return y(d.temperatureLow); })
		 				     .style("fill", "blue");

		 				 // text label for the x axis
		 				 svg.append("text")             
		 				     .attr("transform",
		 				           "translate(" + (width/2) + " ," + 
		 				                          (height + margin.top + 20) + ")")
		 				     .style("text-anchor", "end")
		 				     .attr("fill", "#000")
		 				     .text("Local Time");

		 				 // Add the y Axis
		 				 svg.append("g")
		 				     .call(d3.axisLeft(y));

		 				 // text label for the y axis
		 				 svg.append("text")
							.attr("fill", "#000")
							.attr("transform", "rotate(-90)")
							.attr("y", 0 - margin.left)

							.attr("dy", "1em")
							.attr("text-anchor", "end")
							.text("Temperature"); 

						svg.append("text")
						        .attr("x", (width / 2))             
						        .attr("y", 0 - (margin.top / 3))
						        .attr("text-anchor", "middle")  
						        .text("High/Low Temp Last Week")
						        .style("font-weight", "bold");

	      		  }, 200);

		      	}
		      }
		    };
		    return directiveDefinitionObject;
		  });
 