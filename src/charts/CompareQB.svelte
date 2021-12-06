<script>
    import Section from "../layout/Section.svelte";
    import { getData } from "../utils";
    import { ScatterChart } from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    const dataKeys = {
        Cmp: "Passes Completed",
        Att_p: "Passes Attempted",
        Att_r: "Rushes Attempted",
        Cmp_p: "% Passes Completed",
        Yds_p: "Yards Gained: Passing",
        Yds_r: "Yards Gained: Rushing",
        Int: "# Interceptions"
    };

    let data;
    let xKey = "Att_p";
    let yKey = "Cmp";
    let catKey = "Player";
    let categories = ["Lamar Jackson", "Tom Brady", "Drew Brees", "Patrick Mahomes"];
    // FDC086 7FD27F 386CB0 BEAED4
    let colors = [[127,201,127], [190,174,212], [253,192,134], [56,108,176]];

    getData("data/jackson_compare.csv")
        .then((result) => (data = result));


</script>

<Section>
    <h2>Comparisons: Quarterbacks</h2>
    <p>
        Use the dropdown menu to explore available player stats.
    </p>
    <p>
        Legend:
    </p>
    <p style="background-color: rgb(127,201,127); width: 40%">Lamar Jackson</p>
    <p style="background-color: rgb(190,174,212); width: 40%">Tom Brady</p>
    <p style="background-color: rgb(253,192,134); width: 40%">Drew Brees</p>
    <p style="background-color: rgb(56,108,176); width: 40%">Patrick Mahomes</p>
</Section>

<Media col="wide">
    {#if data && xKey && yKey && catKey}
        <div class="media" style="height: 400px">
            <ScatterChart diameter={20} {data} {xKey} {yKey} {colors} {catKey} {categories} />
        </div>
        <div class="media" style="margin-top: 80px">
            <h3 style="padding-bottom: 10px">Explore the data</h3>
            <span class="label-block">Y Axis</span>
            <select bind:value={yKey}>
                {#each Object.keys(dataKeys) as key}
                    <option value={key}>{dataKeys[key]}</option>
                {/each}
            </select><br />
            <span class="label-block">X Axis</span>
            <select bind:value={xKey}>
                {#each Object.keys(dataKeys) as key}
                    <option value={key}>{dataKeys[key]}</option>
                {/each}
            </select>
        </div>
    {/if}
</Media>

