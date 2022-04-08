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


// for(let i = 0; i < 1000; i++){
// 	Sonic(registry, Math.random(), Math.random(), Math.random(), Math.random());
// }

let step = () => {};
let last = performance.now();
let frames = 0;
let frametimes:number[] = [];
step = () => {
	let now = performance.now()
	let delta = now - last;
	frametimes.push(delta);
	last = now;
	registry.updateSystems(delta);

	for(let i = 0; i < 10; i++){
		Sonic(registry, Math.random(), Math.random(), Math.random(), Math.random());
	}

	if(frames < 5000){
		frames = requestAnimationFrame(step);
	} else {
		console.log(frametimes)
	}
}

step();
