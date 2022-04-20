type V2 = [number, number]
// type V3 = [number, number]
type Tri = [number, number, number];

export default interface IGeometry {
	vertexBuffer:V2[],
	indexBuffer:Tri[],
}

export function addVert(verts:V2[], x:number, y:number, threshold:number = 0) {
	for(let i = 0; i < verts.length; i++){
		if(Math.abs(verts[i][0] - x) + Math.abs(verts[i][1] - y) < threshold) {
			return i;
		}
	}

	verts.push([x, y]);
	return verts.length -1;
}

export function createGeometry():IGeometry {
	return {
		vertexBuffer:[],
		indexBuffer:[]
	}
}

export function insertGeometry(to:IGeometry, from:IGeometry){	
	// Add length of source verts to new indexes
	let fromReindexed:Tri[] = from.indexBuffer.map( tri => 
		tri.map(index => index + to.vertexBuffer.length) as Tri
	)

	// Add verts and indexes to source geometry
	to.indexBuffer.push(...fromReindexed);
	to.vertexBuffer.push(...from.vertexBuffer);
}

export function mergeClose(geo:IGeometry, threshold:number):IGeometry {
	let vertexBuffer:V2[] = [];
	let indexBuffer:V2[] = [];

	let lines = geoToLines(geo);

	for(let i = 0; i < lines.length; i+= 4) {
		let indexes = [
			addVert(vertexBuffer, lines[i], lines[i+1], threshold),
			addVert(vertexBuffer, lines[i+2], lines[i+3], threshold)
		];

		if (indexes[0] != indexes[1]) {
			indexBuffer.push([
				addVert(vertexBuffer, lines[i], lines[i+1], threshold),
				addVert(vertexBuffer, lines[i+2], lines[i+3], threshold)
			]);
		}	
	}

	console.log(vertexBuffer.length, indexBuffer.length)

	return {
		vertexBuffer,
		indexBuffer,
	}
}

export function geoToLines(geo:IGeometry) {
	let lines = [];

	for(let i = 0; i < geo.indexBuffer.length; i++) {
		lines.push(...geo.indexBuffer[i].flatMap(j => geo.vertexBuffer[j]));
	}

	return lines;
}

export function linesToGeo(lines:number[]) {
	let vertexBuffer:V2[] = [];
	let indexBuffer:V2[] = [];

	for(let i = 0; i < lines.length; i+=4) {
		indexBuffer.push([
			addVert(vertexBuffer, lines[i], lines[i+1]),
			addVert(vertexBuffer, lines[i+2], lines[i+3])
		]);
	}

	return {
		vertexBuffer, 
		indexBuffer
	}
}


export function getConnectedLines(geo:IGeometry, line:V2) {
	console.log("GEO", geo);

	let connectedLines:V2[] = [];
	let linesContainingVerts = [line];

	while(linesContainingVerts.length){
		console.log(linesContainingVerts)
		let l = linesContainingVerts.pop()!;
		let verts = [l[0], l[1]];
		connectedLines.push(l);

		linesContainingVerts.push(...geo.indexBuffer
			.filter(line => line.includes(verts[0]) || line.includes(verts[1]))
			.filter(elm => !connectedLines.includes(elm)));
	}

	return connectedLines;	
}

export function separateDisconnected(geo:IGeometry):IGeometry[] {
	let indexes = [...geo.indexBuffer];
	let geometries:IGeometry[] = [];
	
	while(indexes.length){
		console.log(indexes.length)
		indexes.pop()!;
		let connected = getConnectedLines(geo, indexes[0]);

		geometries.push({
			indexBuffer:getConnectedLines(geo, indexes[0]),
			vertexBuffer:geo.vertexBuffer
		})

		indexes = indexes.filter(i => !connected.includes(i));
	}
	console.log(geometries)
	return geometries;
}

export function drawGeo(ctx:CanvasRenderingContext2D, geo:IGeometry, scale:number, fill:boolean = false) {
	ctx.beginPath();
	
	// ctx.moveTo(
	// 	geo.vertexBuffer[geo.indexBuffer[0][0]][0] * scale,
	// 	geo.vertexBuffer[geo.indexBuffer[0][0]][1] * scale
	// );

	for(let i = 0; i < geo.indexBuffer.length; i++) {
		ctx.moveTo(
			geo.vertexBuffer[geo.indexBuffer[i][0]][0] * scale,
			geo.vertexBuffer[geo.indexBuffer[i][0]][1] * scale,
		);

		ctx.lineTo(
			geo.vertexBuffer[geo.indexBuffer[i][1]][0] * scale,
			geo.vertexBuffer[geo.indexBuffer[i][1]][1] * scale,
		);
	}

	fill ? ctx.fill() : ctx.stroke();
}