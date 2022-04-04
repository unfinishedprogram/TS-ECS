export interface IIdeable {
	setId(id:number): void;
	getId():number;
}

export default class InstanceManager<T extends IIdeable> {
	private freeIds:number[] = [];
	private idIndex:number = 1;
	private instances: {[id:number]:T} = {};
	private instanceIds: Set<number> = new Set<number>();

	private getId(){
		return this.freeIds.pop() || this.idIndex++;
	}

	public getAllIds() {
		return this.instanceIds.values();
	}
	
	public remove(id:number) {
		this.instanceIds.delete(id);
		this.freeIds.push(id);
		delete this.instances[id];
	}

	public add(instance:T) {
		let id = this.getId();
		this.instances[id] = instance;
		this.instanceIds.add(id);
		instance.setId(id);
		return id;
	}

	public get(id:number) {
		return this.instances[id];
	}
}
