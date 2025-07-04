<script>
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	import projectsData from '$lib/data/projects.json';

	let links = [];
	let iconz = [];
	let hover = 0;
	let preview;
	let m_index = 0;
	let indexid = 0;
	let isphone = false;

	function mobile_height() {
		isphone = window.innerWidth < 640 || window.innerHeight < 510;
	}

	onMount(() => {
		mobile_height();
		gsap.set([links, iconz], { opacity: 0 });

		const last_img = preview.querySelector('img');
		if (last_img) {
			const img = document.createElement('img');
			img.src = last_img.src;
			img.alt = last_img.alt;
			img.className = last_img.className;
			img.style.objectPosition = last_img.style.objectPosition;

			last_img.remove();
			preview.appendChild(img);
		}

		hover = m_index;

		
		const resize_listener = () => {
			const wasphone = isphone;
			mobile_height();
			
			if (wasphone && !isphone) {
				links.forEach((link, index) => {
					if (link && iconz[index]) {
						gsap.set([link, iconz[index]], { opacity: 0 });
					}
				});
			}
		};

		window.addEventListener('resize', resize_listener);
		return () => window.removeEventListener('resize', resize_listener);
	});

	function projectEnter(index) {
		hover = index;
		if (links[index] && iconz[index]) {
			gsap.to([links[index], iconz[index]], {
				opacity: 1,
				duration: 0.2,
				ease: 'power2.out'
			});
		}

		const current = ++indexid;
		const project = projectsData.projects[index];

		const img = document.createElement('img');
		img.src = project.img;
		img.alt = project.title;
		img.className = 'absolute inset-0 w-full h-full object-cover';
		img.style.objectPosition = 'center';
		img.style.opacity = '0';
		img.style.zIndex = '10';

		preview.appendChild(img);

		gsap.to(img, {
			opacity: 1,
			duration: 0.3,
			ease: 'power2.out',
			onComplete: () => {
				if (current === indexid) {
					const images = preview.querySelectorAll('img');
					images.forEach((img, i) => {
						if (i < images.length - 1) img.remove();
					});
					img.style.zIndex = 'auto';
				}
			}
		});
	}

</script>

<div aria-hidden="true" style="width:0; height:0; overflow:hidden">
	{#each projectsData.projects as p}
		<img src={p.img} alt="" loading="eager" fetchpriority="high" />
	{/each}
</div>

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

	{#each projectsData.projects as project}
		<link rel="preload" as="image" href={project.img} />
	{/each}
</sveltekit:head>

<div
	class="flex min-h-screen flex-col items-center overflow-hidden"
	style="justify-content: flex-start; padding-top: 16vh;"
>
	<div class="mx-auto mb-12 w-full max-w-xs">
		<div class="relative">
			<div
				bind:this={preview}
				class="relative -mb-4 w-full overflow-hidden rounded-lg border border-white/10 bg-gray-800/20 backdrop-blur-sm"
				style="aspect-ratio: 16/9;"
				on:contextmenu|preventDefault
				role="img"
				aria-label={projectsData.projects[hover].title}
			>
				<img
					src={projectsData.projects[hover].img}
					alt={projectsData.projects[hover].title}
					class="absolute inset-0 h-full w-full object-cover"
					style="object-position: center;"
					on:contextmenu|preventDefault
					draggable="false"
				/>
			</div>
			<div
				class="absolute right-2 -bottom-3 left-2 rounded-lg border border-white/10 bg-gray-900/50 px-3 py-2 backdrop-blur-sm"
			>
				<p
					class="text-xs leading-relaxed text-white/70 selection:bg-[#1d2633]"
					style="font-family: 'Consolas', sans-serif;"
				>
					{projectsData.projects[hover].desc}
				</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col space-y-4" class:hidden={isphone}>
		{#each projectsData.projects as project, index}
			<div class="flex items-center justify-center gap-2">
				
				<a
					href={index === 0 ? '/' : '#'}
					class="mr-5 inline-flex items-center font-medium text-white/80 no-underline transition-all duration-300 selection:bg-[#1d2633] hover:text-white/100 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] {index ===
					0
						? ''
						: 'invisible'}"
					aria-label="return home"
					on:contextmenu|preventDefault
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 256 256"
						aria-hidden="true"
					>
						<path
							d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
						></path>
					</svg>
				</a>

				
				<a
					href={project.link}
					target={project.external ? '_blank' : '_self'}
					rel={project.external ? 'noopener noreferrer' : ''}
					class="inline-flex items-center font-medium text-white/80 no-underline transition-colors duration-300 selection:bg-[#1d2633] hover:text-white/100"
					style="font-family: 'Consolas', sans-serif; font-size: 13px;"
					on:mouseenter={() => projectEnter(index)}
					on:mouseleave={() => {
						if (links[index] && iconz[index]) {
							gsap.to([links[index], iconz[index]], {
								opacity: 0,
								duration: 0.2,
								ease: 'power2.out'
							});
						}
					}}
				>
					<span class="relative">
						{project.name}
						<span
							bind:this={links[index]}
							class="absolute -bottom-px left-0 h-px w-full bg-white opacity-0"
						></span>
					</span>
					<span bind:this={iconz[index]} class="ml-1 inline-flex items-center opacity-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 256 256"
						>
							<path
								d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
							></path>
						</svg>
					</span>
				</a>

				<!-- svelte-ignore a11y_invalid_attribute -->
				<a
					href="#"
					class="invisible inline-flex items-center font-medium text-white/80 no-underline transition-all duration-300 selection:bg-[#1d2633] hover:text-white/100 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
					aria-label="next project"
					on:contextmenu|preventDefault
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 256 256"
						aria-hidden="true"
					>
						<path
							d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
						></path>
					</svg>
				</a>
			</div>
		{/each}
	</div>
	
	<div class="flex flex-col space-y-4" class:hidden={!isphone}>
		<div class="flex items-center justify-center gap-2">
			
			<button
				type="button"
				class="mr-5 inline-flex items-center font-medium text-white/80 no-underline transition-all duration-300 selection:bg-[#1d2633] hover:text-white/100 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
				aria-label="previous project"
				on:click={() => {
					m_index = m_index === 0 ? projectsData.projects.length - 1 : m_index - 1;
					hover = m_index;
					projectEnter(m_index);
				}}
				on:contextmenu|preventDefault
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					viewBox="0 0 256 256"
					aria-hidden="true"
				>
					<path
						d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
					></path>
				</svg>
			</button>
			
			<a
				href={projectsData.projects[m_index].link}
				target={projectsData.projects[m_index].external ? '_blank' : '_self'}
				rel={projectsData.projects[m_index].external ? 'noopener noreferrer' : ''}
				class="inline-flex items-center font-medium text-white/80 no-underline transition-colors duration-300 selection:bg-[#1d2633]"
				style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			>
				<span class="relative">
					{projectsData.projects[m_index].name}
					<span class="absolute -bottom-px left-0 h-px w-full bg-white"></span>
				</span>
				<span class="ml-1 inline-flex items-center opacity-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 256 256"
					>
						<path
							d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
						></path>
					</svg>
				</span>
			</a>

			<button
				type="button"
				class="inline-flex items-center font-medium text-white/80 no-underline transition-all duration-300 selection:bg-[#1d2633] hover:text-white/100 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
				aria-label="next project"
				on:click={() => {
					m_index = (m_index + 1) % projectsData.projects.length;
					hover = m_index;
					projectEnter(m_index);
				}}
				on:contextmenu|preventDefault
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					viewBox="0 0 256 256"
					aria-hidden="true"
				>
					<path
						d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
					></path>
				</svg>
			</button>
		</div>
		
		<div class="flex items-center justify-center">
			<a
				href="/"
				class="inline-flex items-center font-medium text-white/80 no-underline transition-colors duration-300 selection:bg-[#1d2633]"
				style="font-family: 'Consolas', sans-serif; font-size: 13px;"
			>
				<span class="relative">
					back
					<span class="absolute -bottom-px left-0 h-px w-full bg-white"></span>
				</span>
			</a>
		</div>
	</div>
</div>
