<script>
    import Section from "../layout/Section.svelte";
    import {onMount} from "svelte";
    import {getData} from "../utils";
    import {ScatterChart} from "@onsvisual/svelte-charts";
    import Media from "../layout/Media.svelte";
    import Scroller from "../layout/Scroller.svelte";

    const threshold = 0.65;
    // State
    let index = [];
    let indexPrev = [];
    onMount(() => {
        indexPrev = [...index];
    });

    const dataKeys = {
        Yds: "Receiving Yards",
        TD_rec: "Receiving Touchdowns",
        TD_all: "All Touchdowns",
        Rec: "Receptions",
        Tgt: "# Targets",
        Ctch_p: "Catching %"
    };

    let data;
    let xKey = "Week";
    let yKey = "Ctch_p";
    let colors = [[166,206,227]];

    getData("data/van_jefferson2021.csv")
        .then((result) => (data = result));

</script>

<Section>
    <h2>Van Jefferson Jr: A Closer Look</h2>
    <p>
        Use the dropdown menu to explore available player stats. Some particularly interesting stats for this player
        include the catching percentage (the % of catches made given the total number of targets), the number of
        fumbles (when a player drops the ball after catching), and both the rushing (running the ball into the end zone)
        and receiving (catching the ball in the end zone) touchdowns.
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

