import System from "@/ecs/system";
import Velocity from "@/components/velocity";
import Position from "@/components/position";

let mouseX = 500;
let mouseY = 500;

window.addEventListener("DOMContentLoaded", () => [
	document.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	})
])


const Movement = new System({Velocity, Position},  
	(t:number, entities) => {
		for(let entity of entities){
			entity.Position.x += entity.Velocity.x * t/10;
			entity.Position.y += entity.Velocity.y * t/10;

			let dist = 0.1 / ((entity.Position.x - mouseX ) ** 2 + (entity.Position.y - mouseY) ** 2) ** 0.6 * t/10;

			entity.Velocity.x -= (entity.Position.x - mouseX) * dist
			entity.Velocity.y -= (entity.Position.y - mouseY) * dist
		}
	}
);

export default Movement;