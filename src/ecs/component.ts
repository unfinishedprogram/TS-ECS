export type ComponentInstantiator = (...args : any[]) => Object;

export default class Component<T extends ComponentInstantiator>{
	public name:string;
	public instantiate: T;

	constructor(
		name:string, 
		instantiate: T,
	) {
		this.instantiate = instantiate;
		this.name = name;
	};
}