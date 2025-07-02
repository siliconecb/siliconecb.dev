<!-- code from reactbits.dev -->
<script>
	import { onMount, onDestroy } from 'svelte';
	import Matter from 'matter-js';

	export let images = [];
	export let trigger = 'auto';
	export let backgroundColor = 'transparent';
	export let wireframes = false;
	export let gravity = 1;
	export let mouseConstraintStiffness = 0.2;
	export let imageSize = 50;
	export let textCollisionElements = [];

	let containerRef;
	let canvasContainerRef;
	let imagesContainerRef;

	let effectStarted = false;
	let engine, render, runner;
	let imageBodies = [];
	let imageElements = [];

	function createTextCollisionBodies(containerRect) {
		const textBodies = [];

		textCollisionElements.forEach((element) => {
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const x = rect.left - containerRect.left + rect.width / 2;
			const y = rect.top - containerRect.top + rect.height / 2;

			const body = Matter.Bodies.rectangle(x, y, rect.width, rect.height, {
				isStatic: true,
				render: {
					fillStyle: wireframes ? 'rgba(255, 0, 0, 0.3)' : 'transparent',
					strokeStyle: wireframes ? 'red' : 'transparent',
					lineWidth: wireframes ? 2 : 0
				}
			});

			textBodies.push(body);
		});

		return textBodies;
	}
	function createSvgCollisionBody(svgPath, x, y, scale = 1) {
		const vertices = parseSvgPathToVertices(svgPath, scale);

		if (vertices.length > 2) {
			return Matter.Bodies.fromVertices(x, y, vertices, {
				render: { fillStyle: 'transparent' },
				restitution: 0.8,
				frictionAir: 0.01,
				friction: 0.2
			});
		}

		return Matter.Bodies.rectangle(x, y, imageSize * scale, imageSize * scale, {
			render: { fillStyle: 'transparent' },
			restitution: 0.8,
			frictionAir: 0.01,
			friction: 0.2
		});
	}

	function parseSvgPathToVertices(pathData, scale = 1) {
		const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
		const vertices = [];
		let currentX = 0;
		let currentY = 0;

		commands.forEach((command) => {
			const type = command[0].toUpperCase();
			const coords = command
				.slice(1)
				.trim()
				.split(/[\s,]+/)
				.map(Number)
				.filter((n) => !isNaN(n));

			switch (type) {
				case 'M':
					currentX = coords[0] * scale;
					currentY = coords[1] * scale;
					vertices.push({ x: currentX, y: currentY });
					break;
				case 'L':
					currentX = coords[0] * scale;
					currentY = coords[1] * scale;
					vertices.push({ x: currentX, y: currentY });
					break;
				case 'H':
					currentX = coords[0] * scale;
					vertices.push({ x: currentX, y: currentY });
					break;
				case 'V':
					currentY = coords[0] * scale;
					vertices.push({ x: currentX, y: currentY });
					break;
			}
		});

		return vertices.length > 2 ? vertices : [];
	}

	function startPhysicsEffect() {
		if (!containerRef || !canvasContainerRef) return;

		const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

		const containerRect = containerRef.getBoundingClientRect();
		const width = containerRect.width;
		const height = containerRect.height;

		if (width <= 0 || height <= 0) return;

		engine = Engine.create();
		engine.world.gravity.y = gravity;

		render = Render.create({
			element: canvasContainerRef,
			engine,
			options: {
				width,
				height,
				background: backgroundColor,
				wireframes
			}
		});

		if (render.canvas) {
			render.canvas.addEventListener('click', handleCanvasClick);
			render.canvas.addEventListener('mouseenter', handleCanvasMouseEnter);
			render.canvas.style.cursor = 'grab';
		}

		const boundaryOptions = {
			isStatic: true,
			render: { fillStyle: 'transparent' }
		};

		const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
		const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
		const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
		const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

		imageBodies = [];
		imageElements = [];

		images.forEach((imageData, index) => {
			const imgElement = document.createElement('img');
			imgElement.src = imageData.src;
			imgElement.style.position = 'absolute';
			imgElement.style.pointerEvents = 'none';
			imgElement.style.userSelect = 'none';
			imgElement.style.zIndex = '10';
			imgElement.style.display = 'block';
			imgElement.style.width = `${imageData.width || imageSize}px`;
			imgElement.style.height = `${imageData.height || imageSize}px`;

			imgElement.onload = () => {
				console.log('Image loaded:', imageData.src);
			};
			imgElement.onerror = () => {
				console.error('Failed to load image:', imageData.src);
			};

			imagesContainerRef.appendChild(imgElement);
			imageElements.push(imgElement);

			const x =
				Math.random() * (width - (imageData.width || imageSize)) +
				(imageData.width || imageSize) / 2;
			const y = Math.random() * 100 - 50;

			let body;

			if (imageData.isSvg && imageData.svgPath) {
				body = createSvgCollisionBody(
					imageData.svgPath,
					x,
					y,
					(imageData.width || imageSize) / 100
				);
			} else {
				body = Bodies.rectangle(x, y, imageData.width || imageSize, imageData.height || imageSize, {
					render: { fillStyle: 'transparent' },
					restitution: 0.8,
					frictionAir: 0.01,
					friction: 0.2
				});
			}

			imgElement.style.left = `${x}px`;
			imgElement.style.top = `${y}px`;
			imgElement.style.transform = 'translate(-50%, -50%)';

			Matter.Body.setVelocity(body, {
				x: (Math.random() - 0.5) * 5,
				y: Math.random() * 2
			});
			Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

			imageBodies.push({ element: imgElement, body, imageData });
		});

		const mouse = Mouse.create(render.canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse,
			constraint: {
				stiffness: mouseConstraintStiffness,
				render: { visible: false }
			}
		});
		render.mouse = mouse;

		const textBodies = createTextCollisionBodies(containerRect);

		World.add(engine.world, [
			floor,
			leftWall,
			rightWall,
			ceiling,
			mouseConstraint,
			...textBodies,
			...imageBodies.map((ib) => ib.body)
		]);

		runner = Runner.create();
		Runner.run(runner, engine);
		Render.run(render);

		const updateLoop = () => {
			imageBodies.forEach(({ body, element }) => {
				const { x, y } = body.position;
				element.style.left = `${x}px`;
				element.style.top = `${y}px`;
				element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
			});
			Matter.Engine.update(engine);
			requestAnimationFrame(updateLoop);
		};
		updateLoop();
	}

	function cleanup() {
		try {
			if (render) {
				if (render.canvas) {
					render.canvas.removeEventListener('click', handleCanvasClick);
					render.canvas.removeEventListener('mouseenter', handleCanvasMouseEnter);
				}
				Matter.Render.stop(render);
				if (render.canvas && render.canvas.parentNode) {
					render.canvas.parentNode.removeChild(render.canvas);
				}
			}
			if (runner) {
				Matter.Runner.stop(runner);
			}
			if (engine) {
				Matter.World.clear(engine.world);
				Matter.Engine.clear(engine);
			}

			imageElements.forEach((element) => {
				if (element && element.parentNode) {
					element.parentNode.removeChild(element);
				}
			});
			imageElements = [];
			imageBodies = [];
		} catch (error) {
			console.warn('cleanup error:', error);
		}
	}

	function handleTrigger() {
		if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
			effectStarted = true;
		}
	}

	function handleCanvasClick() {
		if (trigger === 'click') {
			handleTrigger();
		}
	}

	function handleCanvasMouseEnter() {
		if (trigger === 'hover') {
			handleTrigger();
		}
	}

	function setupScrollObserver() {
		if (!containerRef) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					effectStarted = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		observer.observe(containerRef);

		return () => observer.disconnect();
	}

	$: if (effectStarted) {
		startPhysicsEffect();
	}

	export function addTextCollision(element) {
		if (element && !textCollisionElements.includes(element)) {
			textCollisionElements = [...textCollisionElements, element];
		}
	}

	onMount(() => {
		let cleanup_fn;

		if (trigger === 'auto') {
			effectStarted = true;
		} else if (trigger === 'scroll') {
			cleanup_fn = setupScrollObserver();
		}

		return () => {
			try {
				if (cleanup_fn) cleanup_fn();
				cleanup();
			} catch (error) {
				console.warn('cleanup error:', error);
			}
		};
	});

	onDestroy(() => {
		try {
			cleanup();
		} catch (error) {
			console.warn('cleanup error:', error);
		}
	});
</script>

<div
	bind:this={containerRef}
	class="relative h-full w-full overflow-hidden"
	style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;"
>
	<div
		bind:this={imagesContainerRef}
		class="absolute top-0 left-0 z-10 h-full w-full"
		style="pointer-events: none;"
	></div>

	<div
		bind:this={canvasContainerRef}
		class="absolute top-0 left-0 z-20"
		style="pointer-events: auto;"
	></div>

	<div class="pointer-events-none absolute top-0 left-0 z-30 h-full w-full">
		<slot />
	</div>
</div>

<style>
	div {
		box-sizing: border-box;
	}
</style>
