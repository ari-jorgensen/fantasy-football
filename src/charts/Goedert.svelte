<script>
    import Section from "../layout/Section.svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

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
        .then((result) => (data = result))
        .then((data) => console.log(data));


</script>

<Section>
    <h2>Dallas Goedert: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats.
    </p>
</Section>

<Media col="wide">
    {#if data && xKey && yKey }
        <div class="media" style="height: 400px">
            <ScatterChart diameter={20} {data} {xKey} {yKey} {colors} />
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

