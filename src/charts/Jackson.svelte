<!--This file renders the scatterplot for Lamar Jackson -->
<script>
    import Section from "../layout/Section.svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    // Stats available for player analysis
    const dataKeys = {
        Cmp_p: "% of Passes Completed",
        TD_P: "Passing Touchdowns",
        TD_R: "Rushing Touchdowns",
        Yds_P: "Yards Gained: Passing",
        Yds_R: "Yards Gained: Rushing",
        Fmb: "# Fumbles"
    };

    let data;
    let xKey = "Week";
    let yKey = "Cmp_p";
    let colors = [[166,206,227]];

    getData("data/jackson2021.csv")
        .then((result) => (data = result));

</script>

<Section>
    <h2>Lamar Jackson: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats. For a quarterback, stats such as <mark>passing/rushing
        touchdowns</mark>, as well as number of <mark>fumbles</mark>, are particularly useful.
    </p>
</Section>

<Media col="wide">
    {#if data && xKey && yKey }
        <div class="media" style="height: 400px">
            <ScatterChart diameter={15} {data} {xKey} {yKey} {colors} />
            <p class="x-label">Week</p>
        </div>
        <div class="media" style="margin-top: 80px">
            <h3 style="padding-bottom: 10px">Explore the data</h3>
            <span class="label-block">Y Axis</span>
            <select bind:value={yKey}>
                {#each Object.keys(dataKeys) as key}
                    <option value={key}>{dataKeys[key]}</option>
                {/each}
            </select><br />
        </div>
    {/if}
</Media>
<!--<Media col="wide">-->
<!--    {#if data && xKey && yKey }-->
<!--        <div class="media" style="height: 400px">-->
<!--            <LineChart {data} {xKey} yKey={"TD"} areaOpacity={0.3} mode="stacked" />-->
<!--        </div>-->
<!--        <div class="media" style="margin-top: 80px">-->
<!--            <h3 style="padding-bottom: 10px">Explore the data</h3>-->
<!--            <span class="label-block">Y Axis</span>-->
<!--            <select bind:value={yKey}>-->
<!--                {#each Object.keys(dataKeys) as key}-->
<!--                    <option value={key}>{dataKeys[key]}</option>-->
<!--                {/each}-->
<!--            </select><br />-->
<!--        </div>-->
<!--    {/if}-->
<!--</Media>-->
