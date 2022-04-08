import Component from "@/ecs/component";

// Decomposes bits into an array of indexes, or ids of components

const decomposeCache:Record<number, number[]> = {};

export function decomposeBits(mask:number):number[] {
	if(decomposeCache[mask]) return decomposeCache[mask];

	let arr:number[] = [];

	for (let i = 0; i < 32 && mask > 0; i++) {
		if(mask & 2**i) arr.push(i);
	}

	decomposeCache[mask] = arr;

	return arr;
}

// Bitwise namespace
const Bitwise = {
	hasAll(a:number, b:number):boolean {
		return (a & b) === b;
	}
}

export default Bitwise;