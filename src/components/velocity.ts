import Component from "../ecs/component";

const makeInstance = (x:number, y:number) => { return {x, y} };
const Velocity = new Component("Velocity", makeInstance);

export default Velocity;