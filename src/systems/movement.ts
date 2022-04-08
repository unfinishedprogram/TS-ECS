import System from "@/ecs/system";
import Velocity from "@/components/velocity";
import Position from "@/components/position";

const Movement = new System({Velocity, Position},  
	(t:number, entities) => {
		entities.forEach(entity => {
			entity.Position.x += entity.Velocity.x;
			entity.Position.y += entity.Velocity.y;
		});
	}
);

export default Movement;