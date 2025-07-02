<script>
	import { gsap } from "gsap";
	import { onMount } from "svelte";
	import Glow from "$lib/components/Glow.svelte";

	let underl, projectsL, githubL, wasteofL, mailtoouhh;
	let awesomeGlow;
	let umm = "email";
	let alreadycopied = false;
	
	let timer;
	let inactive = false;
	const brb_time = 5000; // 5 seconds

	onMount(() => {
		gsap.set([underl, projectsL, githubL, wasteofL, mailtoouhh], { opacity: 0 });
		activetracker();
	});
	
	function activetracker() {
		function reset() {
			if (timer) {
				clearTimeout(timer);
			}
			
			if (inactive) {
				inactive = false;
				awesomeGlow?.aww();
			}
			
			timer = setTimeout(() => {
				if (!inactive) {
					inactive = true;
					awesomeGlow?.oohcandy();
				}
			}, brb_time);
		}
		
		document.addEventListener('mousemove', reset);
		reset();
		
		return () => {
			document.removeEventListener('mousemove', reset);
			if (timer) {
				clearTimeout(timer);
			}
		};
	}

	function msEnter(element) {
		gsap.to(element, {
			opacity: 1,
			duration: 0.3,
			ease: "power2.out"
		});
	}

	function msLeave(element) {
		gsap.to(element, {
			opacity: 0,
			duration: 0.3,
			ease: "power2.out"
		});
	}

	async function gibemail() {
		if (alreadycopied) return;
		
		await navigator.clipboard.writeText("hello@siliconecb.dev");
		alreadycopied = true;
		umm = "copied!";
		
		setTimeout(() => {
			umm = "email";
			alreadycopied = false;
		}, 1500);
	}
</script>

<sveltekit:head>
	<title>home - siliconecb</title>
	<meta name="og:title" content="home - siliconecb" />
	<meta name="title" content="home - siliconecb" />
	<meta
		name="og:description"
		content="I'm Jonathan, a programmer mainly focused on robotics (FRC) as well as creating well-formed websites and tools."
	/>
	<meta
		name="description"
		content="I'm Jonathan, a programmer mainly focused on robotics (FRC) as well as creating well-formed websites and tools."
	/>
</sveltekit:head>

<Glow
	bind:this={awesomeGlow}
/>

<div class="flex flex-col items-center justify-center min-h-screen -translate-y-[6%] relative z-10 " role="main" on:contextmenu|preventDefault>
	<img
		src="/images/logo-darkmode.png"
		alt="me"
		class="w-16 ml-0 -mb-1.5 select-none relative z-20 cursor-grab"
		on:contextmenu|preventDefault
		draggable="false"
		on:mouseenter={() => awesomeGlow?.oohcandy()}
		on:mouseleave={() => awesomeGlow?.aww()}
	/>
	<p class="text-xs mt-2 text-center font-medium text-white/80 leading-[19px] max-w-[480px] selection:bg-[#1d2633]" style="font-family: 'Consolas', sans-serif; font-size: 13px;">
		I'm Jonathan, a programmer mainly focused on robotics (<a href="https://www.firstinspires.org/robotics/frc" class="relative no-underline text-inherit font-black" target="_blank" rel="noopener noreferrer" on:mouseenter={() => msEnter(underl)} on:mouseleave={() => msLeave(underl)} on:contextmenu|stopPropagation>FRC<span bind:this={underl} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></a>) as well as creating well-formed tools and websites (like this one!).
	</p>
	<p class="text-xs mt-5 text-center font-[1000] text-white/85 leading-[19px] max-w-[470px] selection:bg-[#1d2633]" style="font-family: 'Consolas', sans-serif; font-size: 13px;">
		A few things you might find cool:
	</p>
	
	<div class="mt-8 flex gap-6 justify-center">
		<a href="/projects" class="relative no-underline text-white/80 hover:text-white/100 transition-colors duration-300 select-none" style="font-family: 'Consolas', sans-serif; font-size: 13px;" on:mouseenter={() => msEnter(projectsL)} on:mouseleave={() => msLeave(projectsL)} on:contextmenu|stopPropagation>projects<span bind:this={projectsL} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></a>
		<a href="https://github.com/siliconecb" class="relative no-underline text-white/80 hover:text-white/100 transition-colors duration-300 select-none" style="font-family: 'Consolas', sans-serif; font-size: 13px;" target="_blank" rel="noopener noreferrer" on:mouseenter={() => msEnter(githubL)} on:mouseleave={() => msLeave(githubL)} on:contextmenu|stopPropagation>github<span bind:this={githubL} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></a>
		<a href="https://wasteof.money/users/siliconecb_" class="relative no-underline text-white/80 hover:text-white/100 transition-colors duration-300 select-none" style="font-family: 'Consolas', sans-serif; font-size: 13px;" target="_blank" rel="noopener noreferrer" on:mouseenter={() => msEnter(wasteofL)} on:mouseleave={() => msLeave(wasteofL)} on:contextmenu|stopPropagation>wasteof<span bind:this={wasteofL} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></a>
		<button on:click={gibemail} class="relative no-underline text-white/80 hover:text-white/100 transition-colors duration-300 bg-transparent border-none cursor-pointer select-none" style="font-family: 'Consolas', sans-serif; font-size: 13px;" on:mouseenter={() => msEnter(mailtoouhh)} on:mouseleave={() => msLeave(mailtoouhh)} on:contextmenu|stopPropagation>{umm}<span bind:this={mailtoouhh} class="absolute w-full h-px -bottom-px left-0 bg-white opacity-0"></span></button>
	</div>
</div>
