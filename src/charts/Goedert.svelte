<!--This file renders the scatterplot for Dallas Goedert -->
<script>
    import Section from "../layout/Section.svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    // Stats available for player analysis
    const dataKeys = {
        Ctch_p: "Catching %",
        TD_all: "All Touchdowns",
        TD_rec: "Receiving Touchdowns",
        Num_off: "# Offensive Snaps",
        Num_def: "# Defensive Snaps",
        Tgts: "Targets",
    };

    let data;
    let xKey = "Week";
    let yKey = "TD_all";
    let colors = [[166,206,227]];

    getData("data/goedert2021.csv")
        .then((result) => (data = result));


</script>

<Section>
    <h2>Dallas Goedert: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats. As a tight end, pay attention to Goedert's number of
        <mark>targets</mark>, as well as the number of <mark>offensive/defensive snaps</mark>.
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

