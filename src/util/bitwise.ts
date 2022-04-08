// Decomposes bits into an array of indexes, or ids of components
const decomposeCache:Record<number, number[]> = {};

// TODO there is probably a faster way of doing this.

export function decomposeBits(mask:number):number[] {
	if(decomposeCache[mask]) return decomposeCache[mask];

	let arr:number[] = [];

	for (let i = 0; i < 32 && mask > 0; i++) {
		if(mask & 2**i) arr.push(i);
	}

	decomposeCache[mask] = arr;

	return arr;
}
