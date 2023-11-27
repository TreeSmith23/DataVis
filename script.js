//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])    // translate to the center of the screen
    .scale([1000]);          // scale things down to see the entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell the path generator to use the albersUsa projection

// Define linear scale for output
var color = d3.scale.linear()
    .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

// Create SVG element and append the map to the SVG
var svg = d3.select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("#map-container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Append Div for data display above the state
var dataDisplay = d3.select("#map-container")
    .append("div")
    .attr("class", "data-display")
    .style("opacity", 0);

// Append title to the map container
var title = d3.select("#map-container")
    .append("h1")
    .text("Interactive COVID-19 Map")
    .style("text-align", "center");

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

            // Get the bounding box of the state
            var bbox = this.getBBox();

            // Calculate the position for the data display div
            var x = bbox.x + bbox.width / 2;
            var y = bbox.y + bbox.height + 5; // Adjust as needed

            // Update the content of the data display div
            dataDisplay.html("<strong>" + stateName + "</strong><br>" +
                "<br>" +
                "<strong>Total Cases:</strong> " + stateData.totalCases + "<br>" +
                "<strong>Total Deaths:</strong> " + stateData.totalDeaths + "<br>" +
                "<strong>Total Recovered:</strong> " + stateData.totalRecovered + "<br>" +
                "<strong>Active Cases:</strong> " + stateData.activeCases)
                .style("left", x + "px")
                .style("top", y + "px")
                .style("opacity", 1);

            d3.select(this)
                .style("fill", "orange"); // Change the fill color when hovering
        })
        // Add mouseout event
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", "rgb(213,222,217)"); // Reset the fill color on mouseout

            // Hide the data display on mouseout
            dataDisplay.style("opacity", 0);
        });
});

d3.csv("data.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        dataDict[data[i].State] = new State(data[i].State, data[i].TotalCases, data[i].TotalDeaths, data[i].TotalRecovered, data[i].ActiveCases);
        dataDict[data[i].State].print();
        console.log("-");
    }
});

// Additional CSV file
d3.csv("total.csv", function(data) {
    // Display USA Total data below the map
    var usaTotalDiv = d3.select("#map-container")
        .append("div")
        .attr("class", "data-display")
        .style("opacity", 1);

    usaTotalDiv.html("<strong>USA Total (updated: Nov 28, 2023)</strong><br>" +
        "<br>" +
        "<strong>Total Cases:</strong> " + data[0].TotalCases + "<br>" +
        "<strong>Total Deaths:</strong> " + data[0].TotalDeaths + "<br>" +
        "<strong>Total Recovered:</strong> " + data[0].TotalRecovered + "<br>" +
        "<strong>Active Cases:</strong> " + data[0].ActiveCases);
});
