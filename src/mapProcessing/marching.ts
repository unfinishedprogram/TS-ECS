interface IMapWeights {
	cells:Vec4[]
}

interface IMapChunkInfo {
	resolution:number,
	size:number, 
	px:number, 
	py:number,
	iso:number,
	pointQuery:PointQuery
}

type PointQuery = (x:number, y:number) => number;



// Relative Position Indexes
//
// 0  1  2
// .  .  .
// 3     4
// .     .
// 5  6  7
// .  .  .

export function createMapGeometry (info:IMapChunkInfo) {
	const cornerWeights = getCornerWeights(info);
	const weightedCells = getWeightedCells(info, cornerWeights);
}

function getCornerWeights(
	info:IMapChunkInfo,
){
	const s = info.size/info.resolution;

	const corners:number[][] = [];
	for(let y = 0; y < info.resolution + 1; y++) {
		corners.push([]);
		for(let x = 0; x < info.resolution + 1; x++) {
			corners[y].push(info.pointQuery((x+info.px-0.5) * s, (y+info.py-0.5) * s));
		}
	}
	return corners;
}

function getWeightedCells(info:IMapChunkInfo, cornerWeights:number[][]) {
	const cells:Vec4[] = [];
	const res = info.resolution;

	for(let y = 0; y < res; y++) {
		for(let x = 0; x < res; x++) {
			cells.push([
				cornerWeights[y][x],
				cornerWeights[y][x+1],
				cornerWeights[y+1][x+1],
				cornerWeights[y+1][x]
			]);
		}
	}

	return cells;
}

function getCornerVertIndex(res:number, cellIndex:number, vertIndex:number) {
	let bufferLength = calcVertCount(res);
}

function createVertexBufferFromCornerWeights(info:IMapChunkInfo, cornerWeights:number[][]) {
	const size = info.size;
	const res = info.resolution;
	const scale = size/res;

	let vertexBuffer:Vec2[] = [];
	vertexBuffer.length = calcVertCount(res);

	// for(let y = 0; y < res; y++){
	// 	for(let x = 0; x < res; x++){
	// 		vertexBuffer[y * (res+1) * 2 + x * 2];
	// 	}
	// }

	for(let y = 0; y < res + 1; y++) {
		for(let x = 0; x < res + 1; x++) {
		}
	}
}

export function calcVertCount(res:number) {
	return ( (res + 1) * res) + (res * 2 + 1) * (res + 1);
}
