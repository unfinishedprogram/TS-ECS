import Bitwise, { decomposeBits } from "@/util/bitwise";
import Component from "./component";
import Entity from "./entity";
import InstanceManager, { IIdeable } from "./instanceManager";
import Query, { IQueryPerams } from "./query";

export default class Registry {
	private entitiyManager = new InstanceManager<Entity>();
	private registeredComponents: Record<number, Component<unknown>> = {};
	private componentInstances : Record<number, Record<number, Object>> = {};
	private archtypes : Record<number, Set<number>> = {};

	public bindComponent<T extends Object>(entityId:number, component:Component<T>) {
		const entity = this.entitiyManager.get(entityId);

		// Setting the corrisponding component bit on the bitmask
		let oldMask = entity.bitMask;

		entity.bitMask |= 2 ** component.id;
		
		this.updateArchtype(entityId, oldMask, entity.bitMask);
		
		this.componentInstances[component.id][entityId] = component.instantiate();
	}

	private updateArchtype(entityId:number, oldMask:number, newMask:number) {
		if(!this.archtypes[newMask]) {
			this.archtypes[newMask] = new Set<number>();
		}

		if(this.archtypes[oldMask]) {
			this.archtypes[oldMask].delete(entityId);
		}

		this.archtypes[newMask].add(entityId);
	}

	private removeComponent(entityId:number, componentId:number) {
		delete this.componentInstances[componentId][entityId];

		let entity = this.entitiyManager.get(entityId);
		let oldMask = entity.bitMask;

		// Bitwise removal of component on mask
		entity.bitMask &= ((~0>>>1) - (2 ** componentId));

		this.updateArchtype(entityId, oldMask, entity.bitMask);
	}
	
	public destroyEntity(entityId:number) {
		const entity = this.entitiyManager.get(entityId);
		
		let compIds = decomposeBits(entity.bitMask);

		this.archtypes[entity.bitMask].delete(entityId);

		for(let id of compIds) {
			delete this.componentInstances[id][entityId]
		}

		this.entitiyManager.remove(entityId);
	}

	public createEntity() {
		let entity = new Entity();
		this.entitiyManager.add(entity);
		return entity.getId();
	}

	public registerComponent<T extends Object> (component : Component<T>) {
		console.log("Registered", component);
		const componentId = component.id;
		this.componentInstances[componentId] = {};
		this.registeredComponents[componentId] = component;
	}

	public getEntities(bitMask:number):number[] {
		let archKeys = Object.keys(this.archtypes).map(Number);

		let matches = archKeys.filter( key => Bitwise.hasAll(key, bitMask));

		let entities:number[] = [];

		matches.forEach(match => {
			entities.push(...this.archtypes[match]);
		})

		return entities;
	}
}