import Registry from "@/ecs/registry";

// Components
import Position from "@/components/position";
import Velocity from "@/components/velocity";
import Sprite from "@/components/sprite";

// Systems
import Renderer from "./systems/renderer";
import Sonic from "./entities/sonic";
import Movement from "./systems/movement";

let registry = new Registry();

registry.registerComponent(Position);
registry.registerComponent(Velocity);
registry.registerComponent(Sprite);

registry.registerSystem(Movement);
registry.registerSystem(Renderer);

let step = () => {};
let last = performance.now();
let frames = 0;
let frametimes:number[] = [];

let perfCont = document.createElement("div");
perfCont.classList.add("perfCont")
let frametime = document.createElement("div");
let entityCount = document.createElement("div");

frametime.classList.add("perf")
entityCount.classList.add("perf")

perfCont.appendChild(frametime)
perfCont.appendChild(entityCount)

document.body.appendChild(perfCont);


let ecount = 0;
step = () => {
	let now = performance.now()
	let delta = now - last;
	frametimes.push(delta);
	frametime.textContent = `fps:${(1000/delta).toFixed(1)}`;
	last = now;
	registry.updateSystems(delta);

	for(let i = 0; i < 10; i++){
		Sonic(registry, Math.random(), Math.random(), Math.random(), Math.random());
	}
	ecount+=10;

	entityCount.textContent = `${ecount}`;
	frames = requestAnimationFrame(step);


	// if(frames < 5000){
	// 	frames = requestAnimationFrame(step);
	// } else {
	// 	console.log(frametimes)
	// }
}

step();
