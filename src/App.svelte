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
	import Goedert from "./charts/Goedert.svelte";
	import Chase from "./charts/Chase.svelte";
	import Beckham from "./charts/Beckham.svelte";
	import Barkley from "./charts/Barkley.svelte";
	import Dillon from "./charts/Dillon.svelte";
	import Folk from "./charts/Folk.svelte";

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

	let animation = getMotion();

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
			selected = { value: "JaMarr Chase", col: "Player" };
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
		loses points (throwing an interception, fumbling the ball, etc.). You go head-to-head with another person in
		your league each week, and the player with the most points wins.
	</p>
</Filler>

<Section>
	<h2>Meet the Team</h2>
	<p>
		First, allow me to introduce you to the team...
	</p>
</Section>

<Divider />
<!--FIRST SECTION: Scrolly scatterplot that updates its view as user scrolls down page. Controlled by chartActions (above)-->
<Scroller {threshold} bind:index={index[0]} splitscreen={true}>
	<div slot="background">
		<figure class="main-scatter">
			<p class="y-label">Fantasy points</p>
			<p class="x-label">Year</p>
			<div class="col-wide middle">
				{#if data && xKey && yKey && categories && colors && catKey && diameter}
				<div class="chart">
					<ScatterChart padding={15} {diameter} {data} {xKey} {yKey} {categories} {colors} {selected} {catKey} />
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
<!--				Hacky color legend!-->
				<h3 class="center">Color Legend</h3>
				<div class="legend-grid">
					<span class="grid-item" style="background-color: rgb(166,206,227,0.8)">Lamar Jackson</span>
					<span class="grid-item" style="background-color: rgb(31,120,180,0.8)">Justin Jefferson</span>
					<span class="grid-item" style="background-color: rgb(178,223,138,0.8)">Devin Singletary</span>
					<span class="grid-item" style="background-color: rgb(51,160,44,0.8)">Dallas Goedert</span>
					<span class="grid-item" style="background-color: rgb(251,154,153,0.8)">Ja’Marr Chase</span>
					<span class="grid-item" style="background-color: rgb(227,26,28,0.8)">DeVonta Smith</span>
					<span class="grid-item" style="background-color: rgb(253,191,111,0.8)">Van Jefferson Jr</span>
					<span class="grid-item" style="background-color: rgb(255,127,0,0.8)">Odell Beckham J</span>
					<span class="grid-item" style="background-color: rgb(202,178,214,0.8)">Saquon Barkley</span>
					<span class="grid-item" style="background-color: rgb(106,61,154,0.8)">AJ Dillon</span>
					<span class="grid-item" style="background-color: rgb(255,255,153,0.8)">Miles Sanders</span>
					<span class="grid-item" style="background-color: rgb(177,89,40,0.8)">Nick Folk</span>
				</div>
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

<!--SECOND SECTION: Individual player analysis. Interactive scatterplots that allow user to explore different stats for -->
<!--each player.-->
<Section>
	<h2>Let's dive deeper...</h2>
	<p>
		Now that we have a better sense of the team as a whole, let's take a closer look at each player as an
		individual. Below, you will find an interactive scatterplot for each player on my team's starting roster. The
		data shown here is from the 2021-2022 NFL season. The x-axis refers to the week (1 game per week). Use the
		dropdown menu to toggle the y-axis values. The values will vary slightly depending on the position of the
		player.
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
	<Chase />
</Section>

<Divider />

<Section>
	<Goedert />
</Section>

<Divider />

<Section>
	<Barkley />
</Section>

<Divider />

<Section>
	<Beckham />
</Section>

<Divider />

<Section>
	<Dillon />
</Section>

<Divider />

<Section>
	<Folk />
</Section>

<Divider />

<!--THIRD SECTION: NFL player comparisons. Users can switch between different positions to compare my team with players -->
<!--from other NFL teams.-->
<Section>
	<h2>Comparisons</h2>
	<p>
		Let's now take a look outside of the team. Scroll down to explore comparisons by player. Use the dropdown menu
		to select a position, then explore the parallel coordinates chart using the brushing and filtering interaction
		tools.
	</p>
</Section>

<Divider />

<iframe width="100%" height="1050"
		src="https://observablehq.com/embed/@ariana/parallel-coordinates-for-data-viz-final?cells=viewof+position%2CchartLegend%2Cviewof+selection">

</iframe>

<Divider />

<style>
	select {
		width: 210px;
	}
	.chart {
		margin-top: 45px;
		height: 100vh;
		width: calc(100% - 5px);
	}
	.legend-grid {
		display: grid !important;
		grid-template-columns: repeat(4, 1fr);
		padding: 5px;
	}
	.grid-item {
		diplay: grid !important;
		text-align: center;
		height: 100px;
	}
	.x-label {
		position: absolute;
		bottom: 60px;
		right: 30px;
		font-weight: bold;
		font-size: 14px;
	}
	.y-label {
		position: absolute;
		top: 10px;
		left: 5px;
		font-weight: bold;
		font-size: 14px;
	}
	.center {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
	iframe {
		border: none;
	}
</style>
