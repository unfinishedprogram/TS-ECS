import Bitwise, { decomposeBits } from "@/util/bitwise";
import Component from "./component";
import Entity from "./entity";
import InstanceManager from "./instanceManager";
import Query, { IQueryParams, QueryResult } from "./query";
import System from "./system";

export type InstancedQuerry<C extends Query<any>> = C extends Query<infer T> ? T : unknown;

export default class Registry {
	private entitiyManager = new InstanceManager<Entity>();
	private registeredComponents: Record<number, Component<unknown>> = {};
	private componentInstances : Record<number, Record<number, Object>> = {};
	private archtypes : Record<number, Set<number>> = {};
	private systems : System<any>[] = [];

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

	private getEntityIdsFromMask<Q>(bitMask:number):number[] {
		let archKeys = Object.keys(this.archtypes).map(Number);

		let matches = archKeys.filter( key => Bitwise.hasAll(key, bitMask));
		console.log(archKeys)

		let entities: number[] = [];

		matches.forEach(match => {
			entities.push(...this.archtypes[match]);
		})

		return entities;
	}

	private getEntitiesFromQuery<T extends IQueryParams>(query:Query<T>):QueryResult<T>[] {
		let entityData: QueryResult<T>[] = [];
		console.log(query.componentIds)

		let eids = this.getEntityIdsFromMask(query.bitMask);
		// console.log(eids);
		eids.forEach(eid => {
			let entity:any = {};
			
			query.componentIds.forEach(cid => {
				entity[this.registeredComponents[cid].name] = this.componentInstances[cid][eid]
			})
			entityData.push(entity);
		})

		return entityData;
	}

	public registerSystem(system:System<any>) {
		this.systems.push(system);
		if(system.methods.bind) {
			this.getEntitiesFromQuery(system.query).forEach(entity => {
				system.methods.bind!(entity);
			});
		}
	}

	private updateSystem<T extends IQueryParams>(system:System<T>) {
		if(system.methods.update) {
			system.methods.update(10,this.getEntitiesFromQuery(system.query));
		}
	}

	public update() {
		this.systems.forEach(sys => {
			this.updateSystem(sys);

		})
	}
}