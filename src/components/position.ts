import Component from "@/ecs/component";

const Position = new Component("Position",
() => {
	return { x:0, y:0 };
})

export default Position;