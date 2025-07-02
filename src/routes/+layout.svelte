<script>
	import '../app.css';
	import { gsap } from "gsap";
	import { onMount } from "svelte";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import Cursor from '$lib/components/Cursor.svelte';
	import Bg from '$lib/components/Bg.svelte';
	
	let { children } = $props();
	let container = $state();
	let fix = $state(false);
	
	let cX = $state(0);
	let cY = $state(0);

	function bgmask(event) {
		cX = event.detail.x;
		cY = event.detail.y;
	}
	
	onMount(() => {
		gsap.set(container, { opacity: 1 });
	});
	
	beforeNavigate((navigation) => {
		if (navigation.type === 'link' || navigation.type === 'goto') {
			fix = true;
			gsap.to(container, {
				opacity: 0,
				duration: 0.3,
				ease: "power2.out"
			});
		}
	});
	
	afterNavigate(() => {
		if (fix) {
			gsap.fromTo(container,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.1 }
			);
			fix = false;
		} else {
			gsap.set(container, { opacity: 1 });
		}
	});

	let error = $derived($page.error !== null);
</script>

{#if error}
	<div bind:this={container}>
		{@render children()}
	</div>
{:else}
	<div class="min-h-screen relative">
		<Bg {cX} {cY} />
		<div class="absolute z-[9999] mix-blend-exclusion"><Cursor on:cursorMove={bgmask} /></div>
		<div bind:this={container}>
			{@render children()}
		</div>
	</div>
{/if}