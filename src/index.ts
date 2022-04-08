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


for(let i = 0; i < 10000; i++){
	Sonic(registry, Math.random(), Math.random(), Math.random(), Math.random());
}

let step = () => {};
step = () => {
	registry.updateSystems();
	requestAnimationFrame(step);
}

step();
