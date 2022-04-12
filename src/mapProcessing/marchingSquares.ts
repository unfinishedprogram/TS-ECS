import GrayscaleBitmap from "./bwBitmap";

type SQ = [number, number, number, number]

function lerp(v0:number, v1:number, t:number) {
	return v0*(1-t)+v1*t
}


const clamp = (num:number, min:number, max:number) => Math.min(Math.max(num, min), max);


namespace MarchingSquares {
	interface ICornerWeightedMap {
		width:number, 
		height:number,
		data:[number, number, number, number][],
	}

	const CORNERS = [
		[-0.5, -0.5], 
		[-0.5, 0.5],  
		[0.5, 0.5],
		[0.5, -0.5],
	]

	export const EDGE_CONNECTIONS = [
		[], // 0
		[2, 3], // 1
		[1, 2], // 2
		[1, 3], // 3
		[0, 1], // 4
		[0, 3, 1, 2], // 5
		[0, 2], // 6
		[0, 3], // 7
		[0, 3], // 8
		[0, 2], // 9
		[0, 1, 2, 3], // 10
		[0, 1], // 11
		[1, 3], // 12
		[1, 2], // 13
		[2, 3], // 14
		[], // 15
	]

	export function getCornerWeights(res:number, pointQuerry:(x:number, y:number) => number):ICornerWeightedMap {
		let data:[number, number, number, number][] = [];
		for(let x = 0; x < res; x++)
			for(let y = 0; y < res; y++)
				data.push(CORNERS.map(
						corner => (pointQuerry(x + corner[0], y + corner[1]) + 1) / 2
					) as [number, number, number, number]
				)

		return {
			width:res, 
			height:res,
			data,
		}
	}
	
	function getConnectionIndex(cell:SQ, iso:number) {
		let cellCase = 0;

		cell.map(c => c > iso ? 1 : 0)
			.forEach((value, i) => {
				cellCase += (2 ** i) * value;
			}
		);

		if(cellCase > 15){
			console.error("Cell case out of bounds", cellCase)
		}

		if(cellCase < 0) {
			console.error("Cell case out of bounds", cellCase)
		}
		return cellCase;
	}
	
	function getT(p1:number, p2:number, isovalue:number) {
		let v1 = 0; 
		let v2 = 0;
		
		[v1, v2] = p1 < isovalue ? [p1, p2] : [p2, p1];

		return (p1-isovalue) / (p1-p2);
	}


	function getNormalizedInterpolatedPosition(t:number) {
		return (
			(1 - t) * 0.5 + 
			t * -0.5);

	  // return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
	}

	export function drawPointValues(ctx:CanvasRenderingContext2D, iso:number, scale:number, map:ICornerWeightedMap) {
		for(let index = 0; index < map.data.length; index++){
			let x = Math.floor(index/map.width)
			let y = index % map.width;

			x *= scale;
			y *= scale;

			let dir = [
				[-0.5, -0.5],
				[0.5, -0.5],
				[0.5, 0.5],
				[-0.5, 0.5]
			];

			dir.forEach((_dir, i) => {
				ctx.fillStyle = map.data[index][i] > iso ? "white" : "gray";
				ctx.fillText(map.data[index][i].toPrecision(3), y + _dir[0] * scale,  x + _dir[1] * scale);
				ctx.beginPath();

				ctx.arc(y + _dir[0] * scale, x + _dir[1] * scale, 1, 0, 2*Math.PI);
				ctx.fill();
			})
		}
	}

	function getGeo(square:SQ, iso:number):number[] {
		let lines:number[] = [];
		let verts:number[][] = [];

		let conIndex = getConnectionIndex(square, iso);

		if (conIndex == 15 || conIndex == 0) return [];


		let top = getT(square[0], square[1], iso);
		let bottom = getT(square[2], square[3], iso);

		let right = getT(square[1], square[2], iso);
		let left = getT(square[3], square[0], iso);



		verts[0] = [getNormalizedInterpolatedPosition(bottom), 0.5];

		verts[1] = [0.5, -getNormalizedInterpolatedPosition(right)];

		verts[2] = [-getNormalizedInterpolatedPosition(top), -0.5];

		verts[3] = [-0.5, getNormalizedInterpolatedPosition(left)];



		// verts[0] = [0, 0.5];
		// verts[1] = [0.5, 0];
		// verts[2] = [0, -0.5];
		// verts[3] = [-0.5, 0];

		let edges = EDGE_CONNECTIONS[conIndex];


		for(let i = 0; i < edges.length; i += 2){
			lines.push(...verts[edges[i]]);
			lines.push(...verts[edges[i+1]]);
		}

		return lines;
	}

	export function getLines(map:ICornerWeightedMap, iso:number) {
		let lines:number[] = [];

		for(let index = 0; index < map.data.length; index++){
			let geo = getGeo(map.data[index], iso);

			let y = index % map.width;
			let x = Math.floor(index/map.width)

			for(let k = 0; k < geo.length; k += 2) {
				geo[ k ] += y;
				geo[ k + 1] += x;
			}
			
			lines.push(...geo)
		}

		return lines;
	} 

	export function drawLines(ctx:CanvasRenderingContext2D, lines: number[], scale:number, alpha:number) {
		ctx.strokeStyle = `rgba(${(1-alpha) * 255}, ${(1-alpha) * 255}, ${(1-alpha) * 255}, 1)`

		ctx.beginPath();

		for(let i = 0; i < lines.length; i+=4){
			ctx.moveTo(lines[i + 0] * scale, lines[i + 1] * scale);
			ctx.lineTo(lines[i + 2] * scale, lines[i + 3] * scale);
		}

		ctx.stroke();
	}
}

export default MarchingSquares;