'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
	/** Force dot color, overriding the theme default. */
	dotColor?: 'auto' | 'black' | 'white';
};

export function DottedSurface({ className, dotColor = 'auto', ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();
	const dark = dotColor === 'auto' ? theme === 'dark' : dotColor === 'white';

	const containerRef = useRef<HTMLDivElement>(null);
	const [failed, setFailed] = useState(false);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		// Guard WebGL creation so a missing/blocked GPU leaves the background blank
		// instead of crashing the app (this is a decorative layer).
		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				alpha: true,
				antialias: true,
			});
		} catch {
			setFailed(true); // WebGL unavailable — show the CSS dot-grid fallback.
			return;
		}
		// Cap pixel ratio — on a HiDPI display the default DPR (2–3) renders 4–9× the
		// pixels for a purely decorative layer, a big GPU drain.
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color, 0);

		// Defensive: clear any leftover canvas (e.g. from a hot-reload) so we
		// never stack multiple WebGL contexts in the same container.
		containerRef.current.replaceChildren();
		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				if (dark) {
					colors.push(255, 255, 255);
				} else {
					colors.push(0, 0, 0);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.8,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;
		let disposed = false;
		let lastFrame = 0;

		// Throttle to ~30fps — the wave reads identically but halves the per-frame
		// cost of a background that runs the whole time the site is open.
		const FRAME_MS = 1000 / 30;

		// Animation function
		const animate = (now = 0) => {
			if (disposed) return;
			animationId = requestAnimationFrame(animate);

			// Skip work when the tab is hidden or the frame budget hasn't elapsed.
			if (document.hidden || now - lastFrame < FRAME_MS) return;
			lastFrame = now;

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves (pronounced up/down wave)
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 90 +
						Math.sin((iy + count) * 0.5) * 90;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			// Update point sizes based on wave
			const customMaterial = material as THREE.PointsMaterial & {
				uniforms?: any;
			};
			if (!customMaterial.uniforms) {
				// For dynamic size changes, we'd need a custom shader
				// For now, keeping constant size for performance
			}

			renderer.render(scene, camera);
			count += 0.06;
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function — fully stop THIS effect's loop and release its
		// WebGL context so contexts/canvases never leak across re-mounts.
		return () => {
			disposed = true;
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', handleResize);

			geometry.dispose();
			material.dispose();
			scene.remove(points);

			// Release the GPU context immediately, then drop the canvas.
			renderer.forceContextLoss();
			renderer.dispose();

			const canvas = renderer.domElement;
			if (canvas.parentNode) {
				canvas.parentNode.removeChild(canvas);
			}

			sceneRef.current = null;
		};
	}, [theme, dark]);

	// CSS dot-grid fallback for environments without WebGL (so the animated
	// background is never just blank).
	if (failed) {
		return (
			<div
				aria-hidden
				className={cn('pointer-events-none fixed inset-0 -z-1', className)}
				style={{
					backgroundImage: dark
						? 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)'
						: 'radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px)',
					backgroundSize: '26px 26px',
				}}
				{...props}
			/>
		);
	}

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 -z-1', className)}
			{...props}
		/>
	);
}
