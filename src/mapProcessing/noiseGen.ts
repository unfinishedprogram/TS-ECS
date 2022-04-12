import SimplexNoise from "simplex-noise";
import MarchingSquares from "./marchingSquares";

let simplex = new SimplexNoise("seed");

type SQ = [number, number, number, number];

const CORNER = [
	[-0.5, -0.5],
	[0.5, -0.5],
	[-0.5, 0.5],
	[0.5, 0.5]
]

export function genMap(area:number, res:number):number[][] {
	let data:number[][] = [];

	let scale = area/res;
	for(let x = 0; x < res; x++){
		data.push([]);
		for(let y = 0; y < res; y++){
			let mag = (Math.min(
				simplex.noise2D(((x+0.5) * scale) / 64, ((y+0.5) * scale)/64), 
				// simplex.noise2D(((x+0.5) * scale) / 64, ((y+0.5) * scale)/128), 
				// simplex.noise2D(((x+0.5) * scale) / 256,((y+0.5) * scale)/256),
				// simplex.noise2D(((x+0.5) * scale) / 512,((y+0.5) * scale)/512),
			));

			data[x].push(mag);
		}
	}
	return data;
}


export function genCornersMap(area:number, res:number):SQ[][] {
	let scale = area/res;

	const getSample = (x:number, y:number) => (
		Math.min(
			simplex.noise2D((x * scale) / 64, (y * scale)/64), 
			simplex.noise2D((x * scale) / 64, (y * scale)/128), 
			simplex.noise2D((x * scale) / 256,(y * scale)/256),
			simplex.noise2D((x * scale) / 512,(y * scale)/512)
		)
	);
	
	let data:SQ[][] = [];
	
	for(let x = 0; x < res; x++){
		data.push([]);
		for(let y = 0; y < res; y++){
			let cell:SQ = [
				getSample(x + CORNER[2][0], y + CORNER[2][1]),
				getSample(x + CORNER[3][0], y + CORNER[3][1]),
				getSample(x + CORNER[1][0], y + CORNER[1][1]),
				getSample(x + CORNER[0][0], y + CORNER[0][1]),
			];

			data[x].push(cell);
		}
	}

	return data;
}



export function getCornerCases(map:SQ[][]):number[][] {
	let data:number[][] = []
	for(let x = 0; x < map.length; x++){
		data.push([]);
		for(let y = 0; y < map[x].length; y++){
			let corCase = 0;

			[...map[x][y]].map(c => c > 0 ? 1 : 0).forEach(
			(value, index) => {
				corCase += (2 ** index) * value;
			});

			data[x].push(corCase)
		}
	}

	return data;
}


export function drawMap(res:number, map:number[][]) {
	let c = document.createElement("canvas");
	c.width = res;
	c.height = res;
	document.body.appendChild(c);

	let ctx = c.getContext("2d")!;
	let imgData = ctx.getImageData(0, 0, res, res);

	console.log(map)

	for(let x = 0; x < res; x++){
		for(let y = 0; y < res; y++){
			// let val = map[x][y] > 0.95 ? 255 : 0;
			let val = ((map[x][y]+0.5)/2) * 512;
			
			imgData.data[ (y + x * res) * 4 + 0] = val
			imgData.data[ (y + x * res) * 4 + 1] = val;
			imgData.data[ (y + x * res) * 4 + 2] = val;
			imgData.data[ (y + x * res) * 4 + 3 ] = 150;
		}
	}
	ctx.putImageData(imgData, 0, 0);
}

export function createLines(mapRes:number, map:SQ[][]) {
	
}

export function drawEdges(mapRes:number, drawRes:number,  cornerCases:number[][], map:SQ[][]) {
	let c = document.createElement("canvas");
	c.width = drawRes;
	c.height = drawRes;
	document.body.appendChild(c);

	const scale = drawRes/mapRes

	let ctx = c.getContext("2d")!;
	// let imgData = ctx.getImageData(0, 0, res, res);
	console.log(map)

	ctx.strokeStyle = "white";

	for(let x = 0; x < map.length; x++){
		for(let y = 0; y < map[x].length; y++){
			// let lines = [...MarchingSquares.CASES[cornerCases[x][y]]];
			// for(let i = 0; i < lines.length; i+=4) {
			// 	ctx.moveTo((lines[i][0] + x) * scale + 0.5, (lines[i][1] + y) * scale + 0.5);
			// 	ctx.lineTo((lines[i+1][0] + x) * scale + 0.5, (lines[i+1][1] + y) * scale + 0.5);
			// }

			// let val = (map[x][y] != 15 && map[x][y] != 0) ? 255 : 0;

			// imgData.data[ (x + y*res) * 4 + 0] = val

			// imgData.data[ (x + y*res) * 4 + 1] = val;
			// imgData.data[ (x + y*res) * 4 + 2] = val;
			// imgData.data[ (x + y*res) * 4 + 3 ] = 255;
		}
	}
	ctx.stroke();
}	
