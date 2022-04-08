export default class Component<TInst extends Function> {
	public name:string;
	public instantiate: TInst;

	constructor(
		name:string, 
		instantiate: TInst,
	) {
		this.instantiate = instantiate;
		this.name = name;
	};
}