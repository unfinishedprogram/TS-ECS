import Query from "@/ecs/query";
import System from "@/ecs/system";
import Sprite from "@/components/sprite";
import Position from "@/components/position";
import * as PIXI from "pixi.js"

let query = new Query({Sprite, Position});

let app = new PIXI.Application({ width: 640, height: 360 });

window.addEventListener("DOMContentLoaded", () => {
	document.body.appendChild(app.view);
})

const Renderer = new System(query, { 
	update: (dt, data) => {
		console.log("updating renderer", data)
		data.forEach(entity => {
			entity.Sprite.sprite.position.set(entity.Position.x, entity.Position.y);
		})

		app.render();
	},
	bind: (data) => {
		app.stage.addChild(data.Sprite.sprite)
		console.log(data.Sprite.sprite)
	},
	unbind: (data) => {
		app.stage.removeChild(data.Sprite.sprite)
	}
});


export default Renderer;