<script>
	import { themes } from '../config.js';
	import { getContext } from 'svelte';

	export let theme = getContext('theme');
</script>

<section style="color: {themes[theme]['text']}; background-color: {themes[theme]['background']}">
	<div class="col-wide">
		<slot></slot>
	</div>
</section>