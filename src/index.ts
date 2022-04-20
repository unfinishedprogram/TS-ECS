// import Registry from "@/ecs/registry";

import { drawGeo, linesToGeo, mergeClose, separateDisconnected } from "./geometry/geometry";
import { altCalcVertCount, calcVertCount, createMapGeometry } from "./mapProcessing/marching";
import MarchingSquares from "./mapProcessing/marchingSquares";
import { sumOctave } from "./util/noise";

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
// 	let now = performance.now();
// 	let delta = now - last;
// 	frametimes.push(delta);
// 	last = now;
// 	registry.updateSystems(delta);

// 	for(let i = 0; i < 10; i++){
// 		Sonic(registry, Math.random() , Math.random() , Math.random() , Math.random());
// 	}

// 	if(frames < 5000){
// 		frames = requestAnimationFrame(step);
// 	} else {
// 		console.log(frametimes)
// 	}
// }

// step();

const qFunc = (x:number, y:number) => sumOctave(32, x, y, 0.5, 0.01, -2, 2);

window.addEventListener("DOMContentLoaded", () => {
	let c = document.createElement("canvas");
	let res = 128;
	let area = 128;

	let scale = (area/res) * 4;

	c.width = 512;
	c.height = 512;
	
	let ctx = c.getContext("2d")!;

	ctx.lineWidth = 0.5;
	ctx.strokeStyle = "white"
	document.body.appendChild(c);

	let iso = 1.8;

	// let map = createMapGeometry(8, 32, 0, 0, iso, qFunc);
	// console.log(map);

	// let weights = MarchingSquares.getCornerWeights(0, 0, area, res, qFunc);
	// let geo = MarchingSquares.generateMapGeometry(weights, iso);

	// let geo = linesToGeo(lines);
	// geo = mergeClose(geo, 0.0001);

	// console.log("Unmodified", geo);
	// console.log("MergedGeom", mergeClose(geo, 0.1))

	// ctx.fillStyle = "white";
	// ctx.strokeStyle = "white";


	// drawGeo(ctx, geo, scale, false);

	// separateDisconnected(geo).forEach(g => {
	// 	drawGeo(ctx, g, scale, false);
	// })	
})

