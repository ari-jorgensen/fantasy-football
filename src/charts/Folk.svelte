<script>
    import Section from "../layout/Section.svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";

    const threshold = 0.65;

    const dataKeys = {
        XPM: "Extra Points Made",
        XPA: "Extra Points Attempted",
        XP: "% Extra Points Made",
        FGM: "Field Goals Made",
        FGA: "Field Goals Attempted",
        FG: "% Field Goals Made"
    };

    let data;
    let xKey = "Week";
    let yKey = "XPM";
    let colors = [[166,206,227]];

    getData("data/folk2021.csv")
        .then((result) => (data = result));

</script>

<Section>
    <h2>Nick Folk: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats. Since Folk is a kicker, the stats to pay attention to
        are the % of field goals & extra points made.
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

