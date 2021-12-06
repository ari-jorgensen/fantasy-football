<script>
    import { getData } from "../utils";
    import * as d3 from "d3";

    const dataKeys = [
        "Cmp",
        "Att_p",
        "Att_r",
        "Cmp_p",
        "Yds_p",
        "Yds_r",
        "Int"
    ];

    let colors = new Map([
        ["Lamar Jackson", [127,201,127]],
        ["Tom Brady", [190,174,212]],
        ["Drew Brees", [253,192,134]],
        ["Patrick Mahomes", [56,108,176]]
    ]);

    let margin = {top: 20, right: 10, bottom: 20, left: 30};

    let data;

    getData("data/jackson_compare.csv")
        .then((result) => (data = result))
        .then(d => {
            let height = dataKeys.length * 120;
            let width = 1000;
            console.log("HELLO")

            let svg = d3.select("svg.parallel");

            let x = new Map(Array.from(dataKeys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]),
                [margin.left, width - margin.right])]));
            let y = d3.scalePoint(dataKeys, [margin.top, height - margin.bottom]);

            let line = d3.line()
                .defined(([, value]) => value != null)
                .x(([key, value]) => x.get(key)(value))
                .y(([key]) => y(key));

            svg.append("g")
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("stroke-opacity", 0.4)
                .selectAll("path")
                .data(data)
                .join("path")
                .attr("stroke", d => colors.get(d.Player))
                .attr("d", d => line(d3.cross(dataKeys, [d], (key, d) => [key, d[key]])))
                .append("title")
                .text(d => d.name);

            svg.append("g")
                .selectAll("g")
                .data(dataKeys)
                .join("g")
                .attr("transform", d => `translate(0,${y(d)})`)
                .each(function(d) { d3.select(this).call(d3.axisBottom(x.get(d))); })
                .call(g => g.append("text")
                    .attr("x", margin.left)
                    .attr("y", -6)
                    .attr("text-anchor", "start")
                    .attr("fill", "currentColor")
                    .text(d => d))
                .call(g => g.selectAll("text")
                    .clone(true).lower()
                    .attr("fill", "none")
                    .attr("stroke-width", 5)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke", "white"));
        });
</script>

<svg class="parallel" width="1000"></svg>