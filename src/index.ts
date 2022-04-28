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
const statsWindow = new StatsWindow();

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

	statsWindow.setStat("fps", (1000/delta).toFixed(1));
	statsWindow.setStat("frameTime", delta.toFixed(2));
	statsWindow.setStat("entityCount", entityCount);
	statsWindow.setStat("frame", frames);

	statsWindow.updateDisplay();
	
	frames = requestAnimationFrame(step);
}

step();
