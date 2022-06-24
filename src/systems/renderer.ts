import System from "../ecs/system";
import Sprite from "../components/sprite";
import Position from "../components/position";
import * as PIXI from "pixi.js"

let app = new PIXI.Application();

app.resizeTo = window;
app.ticker.stop();
app.ticker.autoStart = false;

window.addEventListener("DOMContentLoaded", () => {
	document.body.appendChild(app.view);
})

const Renderer = new System({Sprite, Position},  
	(t:number, entities) => {
		for(let entity of entities) {
			entity.Sprite.sprite.position.set(entity.Position.x, entity.Position.y);
		}
		app.render();
	},

	(entity) => {
		app.stage.addChild(entity.Sprite.sprite)
	},

	(entity) => {
		app.stage.removeChild(entity.Sprite.sprite);
	}
);


export default Renderer;