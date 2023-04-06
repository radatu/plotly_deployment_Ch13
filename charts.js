function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples_clean_data.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

// this function is the trigger when the drop down is used to select a new value
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples_clean_data.json").then((data) => {
    // Bar chart
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter((sampleObj) => sampleObj.id == sample);
    console.log(filteredSamples);

    //  5. Create a variable that holds the first sample in the array.
    var results = filteredSamples[0];
    console.log(results);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids;
    var otu_labels = results.otu_labels;
    var sample_values = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var yticks = otu_ids
      .slice(0, 10)
      .map((otuID) => `OTU ${otuID}`)
      .reverse();

    // 8. Create the trace for the bar chart.
    var barTrace = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: yticks,
        type: "bar",
        orientation: "h",
        text: otu_labels.slice(0, 10).reverse(),
      },
    ];

    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: { text: "Top 10 Bacteria Cultures Found", font: { size: 20 } },
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barTrace, barLayout);

    // Bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = [
      {
        type: "bubble",
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Picnic",
        },
      },
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 },
      font: { size: 14 },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    // Guage chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;

    // Create a variable that holds the first sample in the array.
    var gaugeArray = metadata.filter((metadataObj) => metadataObj.id == sample);
    var gaugeResult = gaugeArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var washFrequency = gaugeResult.wfreq;

    // 3. Create a variable that holds the washing frequency.
    var washFrequency = gaugeResult.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        title: {
          text: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week",
        },
        value: parseFloat(washFrequency),
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ],
        },
      },
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 425, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

init();
