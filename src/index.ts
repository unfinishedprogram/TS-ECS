import Registry from "@/ecs/registry";
import Position from "@/components/position";
import Velocity from "@/components/velocity";
import System from "./ecs/system";
import Sprite from "./components/sprite";
import Renderer from "./systems/renderer";
import Query from "./ecs/query";

let registry = new Registry();

registry.registerComponent(Position);
registry.registerComponent(Velocity);
registry.registerComponent(Sprite);

let eid = registry.createEntity();

registry.bindComponent(eid, Position)
registry.bindComponent(eid, Velocity)
eid = registry.createEntity();

registry.bindComponent(eid, Position)
registry.bindComponent(eid, Sprite)
eid = registry.createEntity();

registry.bindComponent(eid, Velocity)
eid = registry.createEntity();

registry.bindComponent(eid, Velocity)
registry.bindComponent(eid, Position)

let q1 = new Query({Position, Velocity});

let renderables = new Query({Position, Sprite})

registry.registerSystem(Renderer);

// console.log(registry);

registry.update();

