<script>
	import { onMount } from 'svelte';

	export let size = 260;
	export let x = 1.3;
	export let y = 1.3;
	export let refInterval = 8;
	export let alpha = 15;

	let o = 0.95;
	let grainRef;

	onMount(() => {
		const canvas = grainRef;
		const ctx = canvas.getContext('2d');
		let frame = 0;

		const patternCanvas = document.createElement('canvas');
		patternCanvas.width = size;
		patternCanvas.height = size;
		const patternCtx = patternCanvas.getContext('2d');
		const patternData = patternCtx.createImageData(size, size);
		const patternPixelDataLength = size * size * 4;

		const resize = () => {
			canvas.width = window.innerWidth * window.devicePixelRatio;
			canvas.height = window.innerHeight * window.devicePixelRatio;

			ctx.scale(x, y);
		};

		const updatePattern = () => {
			for (let i = 0; i < patternPixelDataLength; i += 4) {
				const value = Math.random() * 255;
				patternData.data[i] = value;
				patternData.data[i + 1] = value;
				patternData.data[i + 2] = value;
				patternData.data[i + 3] = alpha;
			}
			patternCtx.putImageData(patternData, 0, 0);
		};

		const drawGrain = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		const loop = () => {
			if (frame % refInterval === 0) {
				updatePattern();
				drawGrain();
			}
			frame++;
			window.requestAnimationFrame(loop);
		};

		window.addEventListener('resize', resize);
		resize();
		loop();

		return () => {
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas class="absolute inset-0 w-full h-full" style="opacity: {o}" bind:this={grainRef}></canvas>
