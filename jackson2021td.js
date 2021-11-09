let svgT = d3.select("svg.tds"),
    marginT = {top: 40, bottom: 30, left: 50, right: 15},
    widthT = svgT.attr("width") - marginT.left - marginT.right,
    heightT = svgT.attr("height") - marginT.top - marginT.bottom;

let gT= svgT.append("g")
    .attr("transform", "translate("
        + marginT.left + "," + marginT.top + ")");

let xScaleT = d3.scaleBand()
    .range([0, widthT])
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9]);;
let yScaleT = d3.scaleLinear()
    .range([heightT, 0]);
let colorScaleT = d3.scaleOrdinal()
    .range(["#00CC00", "#FF6666", "#730aa3"])
    .domain(["pass", "rush", "lost"]);

// title
svgT.append("text")
    .attr("font-size", "11px")
    .attr("x", (widthT / 2))
    .attr("y", 10)
    .text("Lamar Jackson: 2021 Yards Gained/Lost");
// x-axis label
svgT.append("text")
    .attr("class", "axis-label")
    .attr("x", widthT)
    .attr("y", heightT - 6)
    .text("Week");
// y-axis label
svgT.append("text")
    .attr("class", "axis-label")
    .attr("y", 0)
    .attr("x", marginT.left)
    .text("Yards");

// Hide tooltip
let tooltipT = d3.select("div.tooltip")
    .style("opacity", 0);

// Legend
svgT.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(90,50)");

let legendT = d3.legendColor()
    .title("Legend")
    .shape("circle")
    .shapeRadius(8)
    .orient("vertical")
    .scale(colorScaleT)
    .labels(["Passing Yards", "Rushing Yards", "Yards Lost"]);

svgT.select(".legend")
    .call(legendT)
    .selectAll("text")
    .attr("font-size", "11px");

let pathPointsPass = [];
let pathPointsRush = [];
let pathPointsLost = [];

d3.csv("data/jackson2021.csv", function(d) {
    return {
        week: +d["Week"],
        yds_pass: +d["Yds_P"],
        yds_rush: +d["Yds_R"],
        yds_lost: +d["Yds_L"],
        score: d["Result"]
    };
}).then(data => {
    data.forEach(d => {
        pathPointsPass.push([d.week, d.yds_pass]);
        pathPointsRush.push([d.week, d.yds_rush]);
        pathPointsLost.push([d.week, d.yds_lost]);
    });
    return data;
}).then(data => {
    yScaleT.domain(d3.extent(data, d => d.yds_pass));

    gT.append("g")
        .attr("transform", "translate(0, " + heightT + ")")
        .call(d3.axisBottom(xScaleT));
    gT.append("g")
        .call(d3.axisLeft(yScaleT));

    let chartT = gT.append("g")
        .attr("transform", "translate(30,-8)")

    // Passing
    chartT.selectAll(".circle-rush")
        .data(data)
        .join("circle")
        .attr("class", "circle-pass")
        .attr("cx", d => xScaleT(d.week))
        .attr("cy", d => yScaleT(d.yds_pass))
        .attr("r", 8)
        .on("mouseover", showT)
        .on("mousemove", moveT)
        .on("mouseleave", hideT);

    chartT.append("path")
        .datum(pathPointsPass)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2px")
        .attr("d", function(d) {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(d => xScaleT(+d[0]))
                .y(d => yScaleT(+d[1]))
                (d)
        });

    // Rushing
    chartT.selectAll(".circle-rush")
        .data(data)
        .join("circle")
        .attr("class", "circle-rush")
        .attr("cx", d => xScaleT(d.week))
        .attr("cy", d => yScaleT(d.yds_rush))
        .attr("r", 8)
        .on("mouseover", showT)
        .on("mousemove", moveT)
        .on("mouseleave", hideT);

    chartT.append("path")
        .datum(pathPointsRush)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2px")
        .attr("d", function(d) {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(d => xScaleT(+d[0]))
                .y(d => yScaleT(+d[1]))
                (d)
        });

    // Lost
    chartT.selectAll(".circle-lost")
        .data(data)
        .join("circle")
        .attr("class", "circle-lost")
        .attr("cx", d => xScaleT(d.week))
        .attr("cy", d => yScaleT(d.yds_lost))
        .attr("r", 8)
        .on("mouseover", showT)
        .on("mousemove", moveT)
        .on("mouseleave", hideT);

    chartT.append("path")
        .datum(pathPointsLost)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2px")
        .attr("d", function(d) {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(d => xScaleT(+d[0]))
                .y(d => yScaleT(+d[1]))
                (d)
        });

    d3.selectAll("circle")
        .raise();
});

// Function to show tooltip
const showT = (event, d) => {
    tooltipT.style("opacity", 1)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px");
};
// Function to hide tooltip
const hideT = (event, d) => {
    tooltipT.style("opacity", 0);
}
// Function to move tooltip
const moveT = (event, d) => {
    tooltipT.style("opacity", 1)
        .html("Game Score:&#13;" + d.score)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px");
};
