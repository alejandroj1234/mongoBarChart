// Userlist data array for filling in info box


// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the chart on initial page load
    populateChart();

    // Add User button click
    $('#btnAddChartValue').on('click', addChartValue);

});

// Functions =============================================================


// Fill chart with data when loaded 
function populateChart() {

    // Empty content array 
    var populateChartArray = [];

    // jQuery AJAX call for JSON
    $.getJSON( '/d3Data/d3Chart', function( data ) {
 
         var margin = {top: 20, right: 20, bottom: 30, left: 60},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.ticks(10, "%");

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.xAxis; }));
        //y.domain([0, d3.max(data, function(d) { return parseInt(d.yAxis); })]);
        y.domain([0,20]
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.xAxis); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.yAxis); })
            .attr("height", function(d) { return height - y(d.yAxis); })
            .on('click', function(d) {
                deleteBar(d._id)
            });
    });
};


// Fill chart with data when button clicked 
function addChartValue(event) {
    event.preventDefault();    
    
    // Fill array with chart data 
    var addChartDataArray = {
        'xAxis': $('#addChartValue fieldset input#inputChartXAxis').val(), 
        'yAxis': $('#addChartValue fieldset input#inputChartYAxis').val()
    }
    
    // Use AJAX to post the object to our addChartValue service
    $.ajax({
        type: 'POST',
        data: addChartDataArray,
        url: '/d3Data/addChartValue',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.msg === '') {

            // Clear the form inputs
            $('#addChartValue fieldset input').val('');

            // Remove the old SVG and Update the table with the newly added value
            document.getElementById('chart').firstChild.remove();
            populateChart();

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            console.log('now')
            alert('Error: ' + response.msg);

        }
    });
}

function deleteBar(mongoID) {

    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/d3Data/deleteBar/' + mongoID
    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            console.log('now')
            alert('Error: ' + response.msg);
        }

        // Update the table
        document.getElementById('chart').firstChild.remove();
        populateChart();

    });
}