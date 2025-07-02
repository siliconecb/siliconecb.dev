<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	
	let c = '#0041ef';
	let s = -1; // umm fix probably?
	let ms = 800;
	let opacityig = 0.5;
	let speed = 600;
	
	let canvas;
	let ctx;
	let r = 0;
	let explodeee = 0;
	let currentTween;
	
	export function oohcandy() {
		if (currentTween) currentTween.kill();
		currentTween = gsap.to({ radius: r, intensity: explodeee }, {
			radius: ms,
			intensity: 1,
			duration: speed / 1000,
			ease: "power3.out",
			onUpdate: function() {
				r = this.targets()[0].radius;
				explodeee = this.targets()[0].intensity;
				make();
			}
		});
	}
	
	export function aww() {
		if (currentTween) currentTween.kill();
		currentTween = gsap.to({ radius: r, intensity: explodeee }, {
			radius: s * (64 / 2) / 100,
			intensity: 0,
			duration: speed / 1000,
			ease: "power3.out",
			onUpdate: function() {
				r = this.targets()[0].radius;
				explodeee = this.targets()[0].intensity;
				make();
			}
		});
	}
	
	function toRgb(h) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : { r: 0, g: 65, b: 239 };
	}
	
	function make() {
		if (!ctx || !canvas) return;
		
		const rgb = toRgb(c);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		const logoEl = document.querySelector('img[alt="me"]');
		if (!logoEl) return;
		
		const logoRect = logoEl.getBoundingClientRect();
		const centerX = logoRect.left + logoRect.width / 2;
		const centerY = logoRect.top + logoRect.height / 2;
		
		const numLayers = 8;
		for (let i = 0; i < numLayers; i++) {
			const layerRadius = r * (0.3 + (i / numLayers) * 0.7);
			const layerIntensity = opacityig * explodeee * (1 - i / numLayers) * 0.5;
			
			if (layerIntensity > 0) {
				const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, layerRadius);
				
				gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 1.5})`);
				gradient.addColorStop(0.02, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 1.2})`);
				gradient.addColorStop(0.08, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 0.8})`);
				gradient.addColorStop(0.2, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 0.4})`);
				gradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 0.2})`);
				gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 0.1})`);
				gradient.addColorStop(0.8, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerIntensity * 0.05})`);
				gradient.addColorStop(1, 'transparent');
				
				ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'screen';
				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
		}
		
		ctx.globalCompositeOperation = 'source-over';
	}
	
	onMount(() => {
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		r = (s / 100) * (64 / 2);
		make();
		
		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			make();
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none z-0"
></canvas>