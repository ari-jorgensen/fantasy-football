<!--This file renders the scatterplot for Devin Singletary -->
<script>
    import Section from "../layout/Section.svelte";
    import {onMount} from "svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    // Stats available for player analysis
    const dataKeys = {
        Yds_rush: "Rushing Yards Gained",
        Yds_rec: "Receiving Yards",
        TD_rec: "Receiving Touchdowns",
        TD_rush: "Rushing Touchdowns",
        Tgt: "# Targets",
        Ctch_p: "Catching %",
        Fmb: "# Fumbles"
    };

    let data;
    let xKey = "Week";
    let yKey = "Yds_rush";
    let colors = [[166,206,227]];

    getData("data/singletary2021.csv")
        .then((result) => (data = result));


</script>

<Section>
    <h2>Devin Singletary: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats.
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

