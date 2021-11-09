let svg = d3.select("svg"),
    margin = {top: 30, bottom: 30, left: 50, right: 15},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

let g = svg.append("g")
    .attr("transform", "translate("
    + margin.left + "," + margin.top + ")");

let xScale = d3.scaleBand()
    .range([0, width]);
let yScale = d3.scaleLinear()
    .range([height, 0]);
let colorScale = d3.scaleOrdinal()
    .range(["#00CC00", "#FF6666"])
    .domain(["W", "L"]);

// x-axis label
g.append("text")
    .attr("class", "axis-label")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Week");
// y-axis label
g.append("text")
    .attr("class", "axis-label")
    .attr("y", 0)
    .attr("x", margin.left)
    .text("# Passes Completed");

// Hide tooltip
let tooltip = d3.select("div.tooltip")
    .style("opacity", 0);

// Legend
svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(90,50)");

let legend = d3.legendColor()
    .title("Game Result")
    .shape("circle")
    .shapeRadius(8)
    .orient("vertical")
    .scale(colorScale)
    .labels(["Won", "Lost"]);

svg.select(".legend")
    .call(legend)
    .selectAll("text")
    .attr("font-size", "11px");

const getColor = (d) => {
    if (d.includes("W")) {
        return colorScale("W");
    } else {
        return colorScale("L");
    }
};

let pathPoints = [];

d3.csv("data/jackson2021.csv", function(d) {
    return {
        date: d["Date"],
        week: +d["Week"],
        team: d["Tm"],
        opp_team: d["Opp"],
        score: d["Result"],
        completed: +d["Cmp"],
        attempted_pass: +d["Att"],
        percent_cmp: +d["Cmp%"],
        yards: +d["Yds_P"],
        td_pass: +d["TD_P"],
        interceptions: +d["Int"],
        qb_rating: +d["Rate"],
        sacked: +d["Sk"],
        sacked_loss: +d["Yds_L"],
        yds_per_pass: +d["Y/A_P"],
        attempted_rush: +d["Rush"],
        gained_rush: +d["Yds_R"],
        per_attempt: +d["Y/A_R"],
        td_rush: +d["TD_R"],
        fumbles: +d["Fmb"],
        off_snaps: +d["Num"],
        percent_snaps: d["Pct"]
    };
}).then(data => {
    data.forEach(d => {
        pathPoints.push([d.week, d.completed]);
    });
    return data;
}).then(data => {
    xScale.domain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    yScale.domain(d3.extent(data, d => d.completed));

    g.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xScale));
    g.append("g")
        .call(d3.axisLeft(yScale));

    let chart = g.append("g")
        .attr("transform", "translate(30,-8)")

    chart.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.week))
        .attr("cy", d => yScale(d.completed))
        .attr("r", 8)
        .attr("fill", d => getColor(d.score))
        .on("mouseover", show)
        .on("mousemove", move)
        .on("mouseleave", hide);

    chart.append("path")
        .datum(pathPoints)
        .attr("fill", "none")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", "2px")
        .attr("d", function(d) {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(d => xScale(+d[0]))
                .y(d => yScale(+d[1]))
                (d)
        });

    d3.selectAll("circle")
        .raise();
});

// Function to show tooltip
const show = (event, d) => {
    tooltip.style("opacity", 1)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px");
};
// Function to hide tooltip
const hide = (event, d) => {
    tooltip.style("opacity", 0);
}
// Function to move tooltip
const move = (event, d) => {
    tooltip.style("opacity", 1)
        .html("Game Score:&#13;" + d.score + "&#13;Completed Passes:&#13;" + d.completed)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY + 5) + "px");
};
