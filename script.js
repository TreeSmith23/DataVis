//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geoAlbers()
    .translate([width/2, height/2])    // translate to the center of the screen
    .scale([1000]);          // scale things down to see the entire US

// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell the path generator to use the albersUsa projection

// Define linear scale for output
var color = d3.scaleLinear()
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

var graphContainer = d3.select("#map-container")
    .append("div")
    .attr("id", "graph-container")
    .style("opacity", 0);

const dataDict = {};
const outputDic = {};

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

class outputCase {
    constructor(date1, date2, date3, date4) {
        this.date1 = date1;
        this.date2 = date2;
        this.date3 = date3;
        this.date4 = date4;
    }
}

d3.json("us-states.json").then(function(json) {
    console.log("HEREE");
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
        .on("click", function (d) {
            var stateName = d.properties.name; // Get the state name
            var stateData = dataDict[stateName]; // Access the COVID-19 data for the state
            console.log(outputDic[stateName].date1);
    
            // Create a sample graph using dummy data (replace this with your actual graph implementation)
            var graphData = [
                { date: "2020", cases: outputDic[stateName].date1 },
                { date: "2021", cases: outputDic[stateName].date2 },
                { date: "2022", cases: outputDic[stateName].date3 },
                { date: "2023", cases: outputDic[stateName].date4 }
            ];


    
            // Update the content of the graph container
            let graphName = stateName + " for June 1";
            updateGraph(graphData, graphName);
        })
        // Add mouseout event
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", "rgb(213,222,217)"); // Reset the fill color on mouseout

            // Hide the data display on mouseout
            dataDisplay.style("opacity", 0);
        });
});


d3.csv("data.csv").then(function(data) {
    for (var i = 0; i < data.length; i++) {
        dataDict[data[i].State] = new State(data[i].State, data[i].TotalCases, data[i].TotalDeaths, data[i].TotalRecovered, data[i].ActiveCases);
        dataDict[data[i].State].print();
        console.log("-");
    }
});

d3.csv("output_cases.csv").then(function(data) {
    for (var i = 0; i < data.length; i++) {
        outputDic[data[i].State] = new outputCase(data[i]['6/1/2020'], data[i]['6/1/2021'], data[i]['6/1/2022'], data[i]['6/1/2021']);
        console.log("Debug");
        console.log(data[i].State);
        console.log(data[i]['1/1/2021']);
    }
});


// Additional CSV file
d3.csv("total.csv").then(function(data) {
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

function updateGraph(data, stateName) {
    graphContainer.html("<h3>COVID-19 Data for " + stateName + "</h3>");

    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = 250 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var svg2 = d3.select("#graph-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var xScale = d3.scaleBand()
        .domain(data.map(function (d) { return d.date; }))
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.cases; })])
        .range([height, 0]);

    // Create bars
    svg2.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.date); })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) { return yScale(d.cases); })
        .attr("height", function (d) { return height - yScale(d.cases); });

    // Add axes
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg2.append("g")
        .call(d3.axisLeft(yScale));

    // Adjust opacity to show the graph container
    graphContainer.style("opacity", 1);

}

