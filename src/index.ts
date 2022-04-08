import Registry from "@/ecs/registry";

// Components
import Position from "@/components/position";
import Velocity from "@/components/velocity";
import Sprite from "@/components/sprite";

// Systems
import Renderer from "./systems/renderer";
import Sonic from "./entities/sonic";

let registry = new Registry();

registry.registerComponent(Position);
registry.registerComponent(Velocity);
registry.registerComponent(Sprite);

registry.registerSystem(Renderer);


Sonic(registry, 0, 0, 1, 1);

console.log(registry);

registry.registerSystem(Renderer);

console.log(registry);

// registry.update();

