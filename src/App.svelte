<script>
	import { setContext, onMount } from "svelte";
	import { getData, setColors, getMotion } from "./utils.js";
	import { themes } from "./config.js";
	import { players, colors } from "./config.js"
	import Header from "./layout/Header.svelte";
	import Section from "./layout/Section.svelte";
	import Scroller from "./layout/Scroller.svelte";
	import Filler from "./layout/Filler.svelte";
	import Divider from "./layout/Divider.svelte";
	import Jackson from "./charts/Jackson.svelte";
	import Em from "./ui/Em.svelte";
	import Arrow from "./ui/Arrow.svelte";
	import {ScatterChart} from "@onsvisual/svelte-charts";
	import Jefferson from "./charts/Jefferson.svelte";
	import Singletary from "./charts/Singletary.svelte";
	import Goedert from "./charts/Goedert.svelte";
	import Chase from "./charts/Chase.svelte";
	import Smith from "./charts/Smith.svelte";
	import VanJefferson from "./charts/VanJefferson.svelte";
	import Beckham from "./charts/Beckham.svelte";
	import Barkley from "./charts/Barkley.svelte";
	import Dillon from "./charts/Dillon.svelte";
	import Sanders from "./charts/Sanders.svelte";
	import Folk from "./charts/Folk.svelte";
	import * as d3 from "d3";
	import * as d3Legend from "d3-svg-legend";

	// STYLE CONFIG
	// Set theme globally (options are 'light' or 'dark')
	let theme = "dark";
	setContext("theme", theme);
	setColors(themes, theme);

	// SCROLLYTELLING CONFIG
	// Config
	const threshold = 0.65;
	// State
	let index = [];
	let indexPrev = [];
	onMount(() => {
		indexPrev = [...index];
	});

	// let legendScale = d3.scaleOrdinal()
	// 		.domain(players)
	// 		.range(colors);
	//
	// let legend = d3Legend.legendColor()
	// 		.scale(legendScale);
	//
	// d3.select("svg.legend")
	// 		.call(legend);

	let animation = getMotion(); // Set animation preference depending on browser preference

	let data;
	let diameter = 20;
	let xKey = "Year";
	let yKey = "FantPt";
	let selected;
	let categories;
	let catKey = "Player";

	getData("data/fantasy_stats.csv")
			.then((result) => (data = result))
			.then((data) => {
				categories = Array.from(new Set(data.map((d) => d.Player)));
			});
	// Actions for CHART scroller
	const chartActions = [
		() => {
			selected = null;
		},
		() => {
			selected = { value: "Lamar Jackson", col: "Player" };
		},
		() => {
			selected = { value: "Justin Jefferson", col: "Player" };
		},
		() => {
			selected = { value: "Devin Singletary", col: "Player" };
		},
		() => {
			selected = { value: "Dallas Goedert", col: "Player" };
		},
		() => {
			selected = { value: "Ja’Marr Chase", col: "Player" };
		},
		() => {
			selected = { value: "DeVonta Smith", col: "Player" };
		},
		() => {
			selected = { value: "Van Jefferson Jr", col: "Player" };
		},
		() => {
			selected = { value: "Odell Beckham Jr", col: "Player" };
		},
		() => {
			selected = { value: "Saquon Barkley", col: "Player" };
		},
		() => {
			selected = { value: "AJ Dillon", col: "Player" };
		},
		() => {
			selected = { value: "Miles Sanders", col: "Player" };
		},
		() => {
			selected = { value: "Nick Folk", col: "Player" };
		}
	];

	// Reactive code to trigger CHART actions
	$: if (index[0] != indexPrev[0]) {
		if (chartActions[+index[0]]) {
			chartActions[+index[0]]();
		}
		indexPrev[0] = index[0];
	}

	let playerName = players[0];

</script>

<Header bgimage="./img/background-main.jpg" bgfixed={true} theme="dark">
	<h1 class="text-shadow">Fantasy Football: The Road to Victory</h1>
	<p class="inset-medium text-big text-shadow">Ariana Jorgensen</p>
	<div class="text-shadow" style="margin-top: 48px;">
		<Arrow color="white" {animation}>Scroll to begin</Arrow>
	</div>
</Header>

<Filler theme="dark">
	<p class="text-big">
		I have been playing fantasy football since 2017. Despite my best efforts, I have yet to achieve
		the highest honor: winning first place in the league. I have decided that 2021/2022 will be my year
		for victory. To help achieve this goal, I will use this project to analyze my team and predict the
		likelihood of finally finishing in first place. Join me in my quest to be the best.
	</p>
</Filler>

<Filler theme="light">
	<p class="text-big">
		For those who are unfamiliar, fantasy football is a competition in which you select NFL players from different
		teams to form your "fantasy" team. Each player earns points for plays made (touchdowns, yards gained, etc.) or
		loses points (throwing an interception). You go head-to-head with another person in your league each week, and
		the player with the most points wins.
	</p>
</Filler>

<Section>
	<h2>Meet the Team</h2>
	<p>
		First, allow me to introduce you to the team...
	</p>
</Section>

<Divider />

<h2 class="center">Color Legend</h2>
<div class="legend-grid">
	<p class="grid-item" style="background-color: rgb(166,206,227)">Lamar Jackson</p>
	<p class="grid-item" style="background-color: rgb(31,120,180)">Justin Jefferson</p>
	<p class="grid-item" style="background-color: rgb(178,223,138)">Devin Singletary</p>
	<p class="grid-item" style="background-color: rgb(51,160,44)">Dallas Goedert</p>
	<p class="grid-item" style="background-color: rgb(251,154,153)">Ja’Marr Chase</p>
	<p class="grid-item" style="background-color: rgb(227,26,28)">DeVonta Smith</p>
	<p class="grid-item" style="background-color: rgb(253,191,111)">Van Jefferson Jr</p>
	<p class="grid-item" style="background-color: rgb(255,127,0)">Odell Beckham J</p>
	<p class="grid-item" style="background-color: rgb(202,178,214)">Saquon Barkley</p>
	<p class="grid-item" style="background-color: rgb(106,61,154)">AJ Dillon</p>
	<p class="grid-item" style="background-color: rgb(255,255,153)">Miles Sanders</p>
	<p class="grid-item" style="background-color: rgb(177,89,40)">Nick Folk</p>
</div>

<Divider />

<Scroller {threshold} bind:index={index[0]} splitscreen={true}>
	<div slot="background">
		<figure>
			<div class="col-wide height-full middle">
				{#if data && xKey && yKey && categories && colors && catKey && diameter}
				<div class="chart">
					<ScatterChart {diameter} {data} {xKey} {yKey} {categories} {colors} {selected} {catKey} />
				</div>
				{/if}
			</div>
		</figure>
	</div>

	<div slot="foreground">
		<section>
			<div class="col-medium">
				<p>
					This chart shows the data for the team as a whole. It visualizes the total
					fantasy points per career year for each player. Scroll to see score for
					individual players. <mark>The value mapped to the y-axis is the total number of
					fantasy points for that player for a given year.</mark>
				</p>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Lamar Jackson</Em>.
					<br>Age: 24
					<br>Position: Quarterback
					<br>Team: Baltimore Ravens
				</p>
				<div class="media">
					<img src="./img/jackson.jpg" alt="Lamar Jackson">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Justin Jefferson</Em>.
					<br>Age: 22
					<br>Position: Wide Receiver
					<br>Team: Minnesota Vikings
				</p>
				<div class="media">
					<img src="./img/jefferson.jpg" alt="Justin Jefferson">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Devin Singletary</Em>.
					<br>Age: 24
					<br>Position: Running Back
					<br>Team: Buffalo Bills
				</p>
				<div class="media">
					<img src="./img/singletary.jpg" alt="Devin Singletary">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Dallas Goedert</Em>.
					<br>Age: 26
					<br>Position: Tight End
					<br>Team: Philadelphia Eagles
				</p>
				<div class="media">
					<img src="./img/goedert.jpg" alt="Dallas Goedert">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Ja’Marr Chase</Em>.
					<br>Age: 21
					<br>Position: Wide Receiver
					<br>Team: Cincinnati Bengals
				</p>
				<div class="media">
					<img src="./img/chase.jpg" alt="Ja'Marr Chase">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>DeVonta Smith</Em>.
					<br>Age: 23
					<br>Position: Wide Receiver
					<br>Team: Philadelphia Eagles
				</p>
				<div class="media">
					<img src="./img/smith.jpg" alt="DeVonta Smith">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Van Jefferson Jr</Em>.
					<br>Age: 25
					<br>Position: Wide Receiver
					<br>Team: Los Angeles Rams
				</p>
				<div class="media">
					<img src="./img/van_jefferson.jpg" alt="Van Jefferson Jr">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Odell Beckham Jr</Em>.
					<br>Age: 29
					<br>Position: Wide Receiver
					<br>Team: Los Angeles Rams
				</p>
				<div class="media">
					<img src="./img/beckham.jpg" alt="Odell Beckham Jr">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Saquon Barkley</Em>.
					<br>Age: 24
					<br>Position: Running Back
					<br>Team: New York Giants
				</p>
				<div class="media">
					<img src="./img/barkley.jpg" alt="Saquon Barkley">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>AJ Dillon</Em>.
					<br>Age: 23
					<br>Position: Running Back
					<br>Team: Green Bay Packers
				</p>
				<div class="media">
					<img src="./img/dillon.jpg" alt="AJ Dillon">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Miles Sanders</Em>.
					<br>Age: 24
					<br>Position: Running Back
					<br>Team: Philadelphia Eagles
				</p>
				<div class="media">
					<img src="./img/sanders.jpg" alt="Miles Sanders">
				</div>
			</div>
		</section>
		<section>
			<div class="col-medium">
				<p>
					<Em>Nick Folk</Em>.
					<br>Age: 37
					<br>Position: Kicker
					<br>Team: New England Patriots
				</p>
			</div>
		</section>
	</div>
</Scroller>

<Divider />

<Section>
	<h2>Let's dive deeper...</h2>
	<p>
		Now that we have a better sense of the team as a whole, let's take a closer look at each player as an individual.
	</p>
</Section>

<Divider />

<Section>
	<Jackson />
</Section>

<Divider />

<Section>
	<Jefferson />
</Section>

<Divider />

<Section>
	<Singletary />
</Section>

<Divider />

<Section>
	<Goedert />
</Section>

<Divider />

<Section>
	<Chase />
</Section>

<Divider />

<Section>
	<Smith />
</Section>

<Divider />

<Section>
	<VanJefferson />
</Section>

<Divider />

<Section>
	<Beckham />
</Section>

<Divider />

<Section>
	<Barkley />
</Section>

<Divider />

<Section>
	<Dillon />
</Section>

<Divider />

<Section>
	<Sanders />
</Section>

<Divider />

<Section>
	<Folk />
</Section>

<Divider />

<Section>
	<h2>Comparisons</h2>
	<p>
		Let's now take a look outside of the team. Scroll down to explore comparisons by player.
	</p>
</Section>

<Divider />

<Section>
	<h3>
		Comparison: Quarterbacks
	</h3>
	<p>
		Explore the parallel coordinates chart below to compare my quarterback <mark>(Lamar Jackson)</mark> with other
		top quarterbacks.
	</p>
	<img src="./img/qb_compare.png" class="center">
</Section>

<Section>
	<h3>
		Comparison: Running Backs
	</h3>
	<p>
		Use the chart below to compare my running backs <mark>(Devin Singletary, Miles Sanders, and Saquon Barkley)</mark>
		to each other as well as other top running backs in the league.
	</p>
	<img src="./img/compare_rb.png" class="center">
</Section>

<style>
	/* Styles specific to elements within the demo */
	.hover-span {
		display: flex;
		justify-content: center;
		text-align: center;
		background:rgba(0, 0, 0, 0.7);
		position:absolute;
		opacity:0;
		transition:all 300ms ease-in-out;
		-webkit-transition:all 300ms ease-in-out;
		-moz-transition:all 300ms ease-in-out;
		-o-transition:all 300ms ease-in-out;
		-ms-transition:all 300ms ease-in-out;
	}
	.hover-span:hover {
		opacity: 1;
	}
	.label-block {
		display: inline-block;
		text-align: right;
		width: 80px;
	}
	select {
		width: 210px;
	}
	.chart {
		margin-top: 45px;
		height: 100vh;
		width: calc(100% - 5px);
	}
	.other-section {
		background-color: #606c71;
	}
	.sticky {
		position: fixed;
		top: 0;
		width: 100%
	}
	.legend-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		padding: 10px;
	}
	.grid-item {
		diplay: grid;
		text-align: center;
	}
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
	}
	.top-divider {
		padding: 15px;
	}
	.sticky + .top-divider {
		padding-top: 102px;
	}
</style>
