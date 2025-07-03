<script>
	import Noise from './Noise.svelte';

	export let cX = 0;
	export let cY = 0;
	export let isPhone = false;
</script>

<div
	class="fixed top-0 left-0 w-full h-full bg-[#11111a] -z-10"
	style={isPhone ? "" : "mask-image: radial-gradient(circle 5px at " + cX + "px " + cY + "px, transparent 100%, black 100%); -webkit-mask-image: radial-gradient(circle 5px at " + cX + "px " + cY + "px, transparent 100%, black 100%);"}
>
    <Noise />
</div>
