// Decomposes bits into an array of indexes, or ids of components

export function decomposeBits(mask:number):number[] {
	let arr:number[] = [];
	for (let i = 0; i < 32; i++) {
		if(mask & 2**i) arr.push(i);
	}
	return arr;
}

const Bitwise = {
	hasAll(a:number, b:number):boolean {
		return (a & b) === b;
	}
}

export default Bitwise;