import Component from "@/ecs/component";
import * as PIXI from "pixi.js";


const Sprite = new Component("Sprite", () => {
	return { 
		sprite: PIXI.Sprite.from('assets/sonic.png')
	}
})

export default Sprite;