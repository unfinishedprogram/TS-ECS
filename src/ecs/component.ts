export default class Component<T> {
	static currentId = 0;
	static assignId():number {
		return Component.currentId++;
	}

	public id:number;
	
	constructor(public name:string, public instantiate : () =>  T){
		this.id = Component.assignId();
	};
}