import Component from "@/ecs/component";

const Position = new Component (
	"Position", (x:number, y:number) => {
		return { x:x, y:y };
	});
export default Position;