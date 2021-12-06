<script>
    import Section from "../layout/Section.svelte";
    import {getData} from "../utils";
    import {LineChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    const dataKeys = {
        Cmp: "# Completions",
        TD_p: "% Touchdowns when Attempting to Pass",
        TD: "Passing Touchdowns",
        Yds: "Yards Gained: Passing",
        Yds_R: "Yards Gained: Rushing",
        Int: "# Interceptions"
    };

    let data;
    let xKey = "Year";
    let yKey = "Cmp";
    let colors = [[166,206,227]];

    getData("data/jackson.csv")
        .then((result) => (data = result));

</script>

<Section>
    <h2>Lamar Jackson: Comparisons</h2>
    <p>
        Use the dropdown menu to explore available player stats.
    </p>
</Section>

<Media col="wide">
    {#if data && xKey && yKey }
        <div class="media" style="height: 400px">
            <LineChart {data} {xKey} {yKey} {colors} mode="stacked" />
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

