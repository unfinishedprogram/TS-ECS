import Registry from "@/ecs/registry";

// Components
import Position from "@/components/position";
import Velocity from "@/components/velocity";
import Sprite from "@/components/sprite";

// Systems
import Renderer from "./systems/renderer";
import Sonic from "./entities/sonic";
import Movement from "./systems/movement";
import StatsWindow from "./util/statsWindow";

let registry = new Registry();

registry.registerComponent(Position);
registry.registerComponent(Velocity);
registry.registerComponent(Sprite);

registry.registerSystem(Movement);
registry.registerSystem(Renderer);

let step = () => {};
let last = performance.now();
let frames = 0;
let entityCount = 0;

step = () => {
	let now = performance.now()
	let delta = now - last;

	frames++;
	last = now;
	registry.updateSystems(delta);

	for(let i = 0; i < 5; i++){
		entityCount+=1;
		Sonic(registry, Math.random()*2, Math.random()*2, Math.random()*2, Math.random()*2);
	}

	StatsWindow.instance.setStat("fps", (1000/delta).toFixed(1));
	StatsWindow.instance.setStat("frameTime", delta.toFixed(2));
	StatsWindow.instance.setStat("entityCount", entityCount);
	StatsWindow.instance.setStat("frame", frames);

	frames = requestAnimationFrame(step);
}

step();
