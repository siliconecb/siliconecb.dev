<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import FallingImages from '$lib/components/FallingImages.svelte';
    import { page } from "$app/stores";

	const woah = Array.from({ length: 150 }, () => ({
		src: '/images/logo-transparent.svg',
		width: 62.5,
		height: 62.5
	}));

	let textElement;
	let linkElement;
	let homeL;

	$: text = [textElement, linkElement].filter(Boolean);

	onMount(() => {
		gsap.set(homeL, { opacity: 0 });
	});

	function msEnter(element) {
		gsap.to(element, {
			opacity: 1,
			duration: 0.3,
			ease: 'power2.out'
		});
	}

	function msLeave(element) {
		gsap.to(element, {
			opacity: 0,
			duration: 0.3,
			ease: 'power2.out'
		});
	}
</script>

<sveltekit:head>
	<title>{$page.status} - siliconecb</title>
	<meta name="og:title" content="{$page.status} - siliconecb" />
	<meta name="title" content="{$page.status} - siliconecb" />
	<meta
		name="og:description"
		content="you probably don't want to click here - {$page.status}"
	/>
	<meta
		name="description"
		content="you probably don't want to click here - {$page.status}"
	/>
</sveltekit:head>

<div class="relative m-0 h-screen w-screen p-0" style="background-color: #0041ef;">
	<FallingImages
		images={woah}
		trigger="auto"
		gravity={1}
		imageSize={60}
		textCollisionElements={text}
		wireframes={false}
	>
		<div class="flex h-full -translate-y-[6%] flex-col items-center justify-center">
			<h1
				bind:this={textElement}
				class="pointer-events-auto text-4xl font-bold text-[#4d79f3] select-text"
				style="font-family: 'Consolas', sans-serif;"
			>
				oh s#!t - {$page.status}
			</h1>
			<div class="mt-1">
				<a
					bind:this={linkElement}
					href="/"
					class="pointer-events-auto relative text-white/80 no-underline transition-colors duration-300 select-none hover:text-white/100"
					style="font-family: 'Consolas', sans-serif; font-size: 15px;"
					on:mouseenter={() => msEnter(homeL)}
					on:mouseleave={() => msLeave(homeL)}
					on:contextmenu|stopPropagation
					>just go back already<span
						bind:this={homeL}
						class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
					></span></a
				>
			</div>
		</div>
	</FallingImages>
</div>
