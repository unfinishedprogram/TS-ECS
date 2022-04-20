import IGeometry, { createGeometry } from "@/geometry/geometry";

type SQ = [number, number, number, number]


namespace MarchingSquares {
	let map:ICornerWeightedMap | undefined = undefined;

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

	const EDGE_CONNECTIONS = [
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

	export function getCornerWeights(cx:number, cy:number, area:number, res:number, pointQuery:(x:number, y:number) => number):ICornerWeightedMap {
		let data:SQ[] = [];
		let step = area/res;

		for(let x = 0; x < res; x++)
			for(let y = 0; y < res; y++) 
				data.push(
					CORNERS.map(c => 
						pointQuery(
							(x + cx + c[0]) * step, 
							(y + cy + c[1]) * step
						) + 1
					) as SQ
				);

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

		return cellCase;
	}
	
	function getT(p1:number, p2:number, isovalue:number) {
		return (p1-isovalue) / (p1-p2);
	}

	function getNormalizedInterpolatedPosition(t:number) {
		return ( (1 - t) * 0.5 + t * -0.5);
	}

	export function generateMapGeometry(map:ICornerWeightedMap, iso:number):IGeometry{

		let lines:number[] = [];

		let geo:IGeometry = createGeometry();

		for(let index = 0; index < map.data.length; index++){
			let geo = getCellGeometry(map.data[index], iso);

			let y = index % map.width;
			let x = Math.floor(index/map.width)

			for(let k = 0; k < geo.length; k += 2) {
				geo[ k ] += y;
				geo[ k + 1] += x;
			}
			
			lines.push(...geo)
		}

		return geo;
	}

	function getCellGeometry(square:SQ, iso:number):number[] {
		let lines:number[] = [];
		let verts:[number, number][] = [];

		let conIndex = getConnectionIndex(square, iso);

		if (conIndex == 15 || conIndex == 0) return []	

		let top = getT(square[0], square[1], iso);
		let bottom = getT(square[2], square[3], iso);
		let right = getT(square[1], square[2], iso);
		let left = getT(square[3], square[0], iso);

		verts = [
			[getNormalizedInterpolatedPosition(bottom), 0.5],
			[0.5, -getNormalizedInterpolatedPosition(right)],
			[-getNormalizedInterpolatedPosition(top), -0.5 ],
			[-0.5, getNormalizedInterpolatedPosition(left) ]
		];

		let edges = EDGE_CONNECTIONS[conIndex];

		for(let i = 0; i < edges.length; i += 2){
			lines.push(...verts[edges[i]]);
			lines.push(...verts[edges[i+1]]);
		}

		return lines;
	}

	export function drawLines(ctx:CanvasRenderingContext2D, lines: number[], scale:number) {
		ctx.strokeStyle = "white"
		ctx.beginPath();

		for(let i = 0; i < lines.length; i+=4){
			ctx.moveTo(lines[i + 0] * scale, lines[i + 1] * scale);
			ctx.lineTo(lines[i + 2] * scale, lines[i + 3] * scale);
		}

		ctx.stroke();
	}
}

export default MarchingSquares;