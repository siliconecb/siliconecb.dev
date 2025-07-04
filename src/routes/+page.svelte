<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import Glow from '$lib/components/Glow.svelte';

	let underl, projectsL, githubL, wasteofL, mailtoouhh;
	let awesomeGlow;
	let umm = 'email';
	let alreadycopied = false;

	let timer;
	let isphone;
	let inactive = false;
	const brb_time = 2000;
	let cleanup_tracker;

	function mobile_check() {
		isphone = window.innerWidth < 640 || window.innerHeight < 510;
	}

	onMount(() => {
		gsap.set([underl, projectsL, githubL, wasteofL, mailtoouhh], { opacity: 0 });

		mobile_check();

		if (isphone) {
			awesomeGlow?.oohcandy();
		} else {
			cleanup_tracker = activetracker();
		}

		const resize_listener = () => {
			const wasphone = isphone;
			mobile_check();
			
			if (wasphone && !isphone) {
				awesomeGlow?.aww();
				cleanup_tracker = activetracker();
			}
			else if (!wasphone && isphone) {
				if (cleanup_tracker) {
					cleanup_tracker();
					cleanup_tracker = null;
				}
				awesomeGlow?.oohcandy();
			}
		};

		window.addEventListener('resize', resize_listener);
		
		return () => {
			window.removeEventListener('resize', resize_listener);
			if (cleanup_tracker) {
				cleanup_tracker();
			}
		};
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

	async function gibemail() {
		if (alreadycopied) return;

		await navigator.clipboard.writeText('hello@siliconecb.dev');
		alreadycopied = true;
		umm = 'copied!';

		setTimeout(() => {
			umm = 'email';
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

<Glow bind:this={awesomeGlow} />

<div
	class="relative z-10 flex min-h-screen -translate-y-[6%] flex-col items-center justify-center"
	role="main"
	on:contextmenu|preventDefault
>
	<img
		src="/images/logo-darkmode.png"
		alt="me"
		class="relative z-20 -mb-1.5 ml-0 w-16 cursor-grab select-none"
		on:contextmenu|preventDefault
		draggable="false"
		on:mouseenter={() => !isphone && awesomeGlow?.oohcandy()}
		on:mouseleave={() => !isphone && awesomeGlow?.aww()}
	/>
	<p
		class="mx-auto mt-2 w-full max-w-[480px] px-6 text-center text-xs leading-[19px] font-medium text-white/80 selection:bg-[#1d2633] sm:px-4"
		style="font-family: 'Consolas', sans-serif; font-size: 13px;"
	>
		I'm Jonathan, a programmer mainly focused on robotics (<a
			href="https://www.firstinspires.org/robotics/frc"
			class="relative font-black text-inherit no-underline"
			target="_blank"
			rel="noopener noreferrer"
			on:mouseenter={() => msEnter(underl)}
			on:mouseleave={() => msLeave(underl)}
			on:contextmenu|stopPropagation
			>FRC<span bind:this={underl} class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
			></span></a
		>) as well as creating well-formed tools and websites (like this one!).
	</p>
	<p
		class="mt-5 max-w-[470px] text-center text-xs leading-[19px] font-[1000] text-white/85 selection:bg-[#1d2633]"
		style="font-family: 'Consolas', sans-serif; font-size: 13px;"
	>
		A few things you might find cool:
	</p>

	<div class="mt-8 flex justify-center gap-6">
		<a
			href="/projects"
			class="relative text-white/80 no-underline transition-colors duration-300 select-none hover:text-white/100"
			style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			on:mouseenter={() => msEnter(projectsL)}
			on:mouseleave={() => msLeave(projectsL)}
			on:contextmenu|stopPropagation
			>projects<span
				bind:this={projectsL}
				class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
			></span></a
		>
		<a
			href="https://github.com/siliconecb"
			class="relative text-white/80 no-underline transition-colors duration-300 select-none hover:text-white/100"
			style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			target="_blank"
			rel="noopener noreferrer"
			on:mouseenter={() => msEnter(githubL)}
			on:mouseleave={() => msLeave(githubL)}
			on:contextmenu|stopPropagation
			>github<span
				bind:this={githubL}
				class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
			></span></a
		>
		<a
			href="https://wasteof.money/users/siliconecb_"
			class="relative text-white/80 no-underline transition-colors duration-300 select-none hover:text-white/100"
			style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			target="_blank"
			rel="noopener noreferrer"
			on:mouseenter={() => msEnter(wasteofL)}
			on:mouseleave={() => msLeave(wasteofL)}
			on:contextmenu|stopPropagation
			>wasteof<span
				bind:this={wasteofL}
				class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
			></span></a
		>
		<button
			on:click={gibemail}
			class="relative cursor-pointer border-none bg-transparent text-white/80 no-underline transition-colors duration-300 select-none hover:text-white/100"
			style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			on:mouseenter={() => msEnter(mailtoouhh)}
			on:mouseleave={() => msLeave(mailtoouhh)}
			on:contextmenu|stopPropagation
			>{umm}<span
				bind:this={mailtoouhh}
				class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
			></span></button
		>
	</div>
</div>
