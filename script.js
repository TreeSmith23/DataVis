//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])    // translate to center of screen
    .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear()
        .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);


//Create SVG element and append map to the SVG
var svg = d3.select("#map-container")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("#map-container")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);


var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


const dataDict = {};

class State {
	constructor(name, totalCases, totalDeaths, totalRecovered, activeCases) {
	  this.name = name;
	  this.totalCases = totalCases;
	  this.totalDeaths = totalDeaths;
	  this.totalRecovered = totalRecovered;
	  this.activeCases = activeCases;
	}
	name() {
		return this.name;
	}
	totalCases() {
		return this.totalCases;
	}
	totalDeaths() {
		return this.totalDeaths;
	}
	totalRecovered() {
		return this.totalRecovered;
	}
	activeCases() {
		return this.activeCases;
	}
	print() {
		console.log(this.name);
		console.log(this.totalCases);
		console.log(this.totalDeaths);
		console.log(this.totalRecovered);
		console.log(this.activeCases);
	}
  }

d3.json("us-states.json", function(json) {

		
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {
	return "rgb(213,222,217)";
})
.on("mouseover", function(d) {
	var stateName = d.properties.name; // Get the state name
    var stateData = dataDict[stateName]; // Access the COVID-19 data

    tooltip.html("<strong>" + stateName + "</strong><br>" +
        "Total Cases: " + stateData.totalCases + "<br>" +
        "Total Deaths: " + stateData.totalDeaths + "<br>" +
        "Total Recovered: " + stateData.totalRecovered + "<br>" +
        "Active Cases: " + stateData.activeCases)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("opacity", 1);

    d3.select(this)
        .style("fill", "orange"); // Change the fill color when hovering
})
// Add mouseout event
.on("mouseout", function(d) {
    d3.select(this)
        .style("fill", "rgb(213,222,217)"); // Reset the fill color on mouseout
});



d3.csv("data.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
		dataDict[data[i].State] = new State(data[i].State, data[i].TotalCases, data[i].TotalDeaths, data[i].TotalRecovered, data[i].ActiveCases);
        dataDict[data[i].State].print();
		console.log("-");
    }

    // Now, you can access the COVID-19 data for a state like this:
    // const alabamaData = dataDict["Alabama"];
    // console.log(alabamaData);
});


});