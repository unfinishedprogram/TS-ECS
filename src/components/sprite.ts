import Component from "@/ecs/component";
import * as PIXI from "pixi.js";


const Sprite = new Component("Sprite", () => {
	let spr = PIXI.Sprite.from(Math.random() > 0.5 ? 'assets/sonic.png' : 'assets/link.png');
	spr.alpha = Math.random();
	spr.tint = Math.random() * 0xFFFFFF;
	return { 
		sprite: spr
	}
})

export default Sprite;