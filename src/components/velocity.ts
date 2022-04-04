import Component from "@/ecs/component";

const Velocity = new Component("Velocity", 
() => {
	return { x:0, y:0 };
})

export default Velocity;