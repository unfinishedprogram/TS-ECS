// import Registry from "@/ecs/registry";

import SimplexNoise from "simplex-noise";
import MarchingSquares from "./mapProcessing/marchingSquares";
import { drawMap, genMap } from "./mapProcessing/noiseGen";

// // Components
// import Position from "@/components/position";
// import Velocity from "@/components/velocity";
// import Sprite from "@/components/sprite";

// // Systems
// import Renderer from "./systems/renderer";
// import Sonic from "./entities/sonic";
// import Movement from "./systems/movement";

// let registry = new Registry();

// registry.registerComponent(Position);
// registry.registerComponent(Velocity);
// registry.registerComponent(Sprite);

// registry.registerSystem(Movement);
// registry.registerSystem(Renderer);

// let step = () => {};
// let last = performance.now();
// let frames = 0;
// let frametimes:number[] = [];
// step = () => {
// 	let now = performance.now()
// 	let delta = now - last;
// 	frametimes.push(delta);
// 	last = now;
// 	registry.updateSystems(delta);

// 	for(let i = 0; i < 10; i++){
// 		Sonic(registry, Math.random(), Math.random(), Math.random(), Math.random());
// 	}

// 	if(frames < 5000){
// 		frames = requestAnimationFrame(step);
// 	} else {
// 		console.log(frametimes)
// 	}
// }

// step();

window.addEventListener("DOMContentLoaded", () => {
	let res = 128;
	let area = 1024
	let scale = area/res;
	
	let nmap = genMap(area, res * 8);

	// drawMap(res * 8, nmap);

	let simplex = new SimplexNoise("seed");

	let c = document.createElement("canvas");

	c.width = 1024*4;
	c.height = 1024*4;
	
	let ctx = c.getContext("2d")!;
	ctx.lineWidth = 4;

	document.body.appendChild(c);

	let map = MarchingSquares.getCornerWeights(res, (x, y) => 
		Math.min(
			simplex.noise2D((x * scale) / 64, (y * scale)/64),
			simplex.noise2D((x * scale) / 64, (y * scale)/128), 
			simplex.noise2D((x * scale) / 256,(y * scale)/256),
			simplex.noise2D((x * scale) / 512,(y * scale)/512)
		)
	);

	let iso = 0.6;

	// setInterval(() => {
	// 	ctx.clearRect(0, 0, c.width, c.height)
	// 	let lines = MarchingSquares.getLines(map, iso);
	// 	MarchingSquares.drawLines(ctx, lines, scale * 16, iso);
	// 	iso+=0.001;
	// }, 100)



	let lines = MarchingSquares.getLines(map, iso);

	MarchingSquares.drawLines(ctx, lines, scale *4, iso);

	// MarchingSquares.drawPointValues(ctx, iso, scale * 16, map);
})

