import Position from "@/components/position";
import Sprite from "@/components/sprite";
import Velocity from "@/components/velocity";
import Registry from "@/ecs/registry";

export default function Sonic(registry:Registry, x:number, y:number, vx:number, vy:number) {
	let id = registry.createEntity();

	registry.bindComponent(id, Velocity, vx, vy);
	registry.bindComponent(id, Position, x, y);
	registry.bindComponent(id, Sprite);
}