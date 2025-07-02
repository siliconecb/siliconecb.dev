<script>
	import { gsap } from "gsap";
	import { onMount } from "svelte";

	let underl;

	onMount(() => {
		gsap.set(underl, { opacity: 0 });
	});

	function msEnter() {
		gsap.to(underl, {
			opacity: 1,
			duration: 0.3,
			ease: "power2.out"
		});
	}

	function msLeave() {
		gsap.to(underl, {
			opacity: 0,
			duration: 0.3,
			ease: "power2.out"
		});
	}
</script>

<sveltekit:head>
	<title>projects - siliconecb</title>
	<meta name="og:title" content="projects - siliconecb" />
	<meta name="title" content="projects - siliconecb" />
	<meta
		name="og:description"
		content="I'm Jonathan, a programmer mainly focused on robotics (FRC) as well as creating well-formed websites and tools."
	/>
	<meta
		name="description"
		content="I'm Jonathan, a programmer mainly focused on robotics (FRC) as well as creating well-formed websites and tools."
	/>
</sveltekit:head>

<div class="flex flex-col items-center justify-center min-h-screen -translate-y-[6%]">
	<p class="text-xs mt-2 text-center font-medium text-white/80 leading-[19px] max-w-[470px]" style="font-family: 'Consolas', sans-serif; font-size: 13px;">
		coming soon...
	</p>
	
	<div class="mt-8">
		<a href="/" class="relative no-underline font-medium text-white/80 hover:text-white/100 transition-colors duration-300" style="font-family: 'Consolas', sans-serif; font-size: 13px;" on:mouseenter={msEnter} on:mouseleave={msLeave}>back<span bind:this={underl} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></a>
	</div>
</div>