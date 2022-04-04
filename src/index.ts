import Registry from "@/ecs/registry";
import Position from "@/components/position";
import Velocity from "@/components/velocity";
import Query from "./ecs/query";


let registry = new Registry();

registry.registerComponent(Position);
registry.registerComponent(Velocity);

let eid = registry.createEntity();

registry.bindComponent(eid, Position)
registry.bindComponent(eid, Velocity)
eid = registry.createEntity();

registry.bindComponent(eid, Position)
eid = registry.createEntity();

registry.bindComponent(eid, Velocity)
eid = registry.createEntity();

registry.bindComponent(eid, Velocity)
registry.bindComponent(eid, Position)

let q1 = new Query({Position, Velocity});
let q2 = new Query({Velocity});
let q3 = new Query({Position});


console.log("Position:", registry.getEntities(1))
console.log("Velocity:", registry.getEntities(2))


registry.destroyEntity(1);
console.log(registry);

