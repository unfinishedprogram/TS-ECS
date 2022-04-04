import Component from "./component";

interface IQueryResult<T> {
	size:number;
}
export interface IQueryPerams {
	[key:string]:Component<unknown>
}

export default class Query<T extends IQueryPerams> {
	public componentIds:Set<number>;
	public bitMask:number = 0;

	equals(other:Query<T>):boolean {
		if(other.componentIds.size != this.componentIds.size) return false;
		for(let val of other.componentIds) {
			if(!this.componentIds.has(val)) return false;
		}
		return true;
	}

	constructor(components: T) {
		this.componentIds = new Set<number>();
		
		for (let comp in components) {
			this.bitMask |= 2 ** components[comp].id;
		}
	}
}

// type test = <[{ x: number; y: number;}]>(components_0: Component<{x: number; y: number;}>): Query<[{x: number;y: number;}]>