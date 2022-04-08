import { decomposeBits } from "@/util/bitwise";
import { sign } from "@pixi/utils";
import Component from "./component";
import System from "./system";

type Signature = number;
type EID = number;
type CID = number;
type SID = number;

export default class Registry {
	/************
	 * ENTITIES *
	 ************/

	private freeEntityIds:Set<EID> = new Set();
	private entityIdIndex = 0;
	private entities:Set<EID> = new Set();
	private entitySignatures:Record<EID, Signature> = {};

	removeEntity(eid:EID) {
		// Decompose signature
		let entitySignature = this.entitySignatures[eid];

		this.signatureCache.get(entitySignature)?.delete(eid);

		decomposeBits(this.entitySignatures[eid]).forEach(cid => {
			this.unbindComponent(cid, this.componentFromId[eid]);
		})
		delete this.entitySignatures[eid];
		this.entities.delete(eid);
		this.freeEntityIds.add(eid);
	}
	
	createEntity():EID {
		const freeIds = [...this.freeEntityIds.values()];
		const eid = freeIds.length ? freeIds[0] : this.entityIdIndex++;
		this.freeEntityIds.delete(eid);
		this.entities.add(eid)
		this.entitySignatures[eid] = 0;

		return eid;
	}

	/**************
	 * COMPONENTS *
	 **************/

	private componentIdIndex = 0;
	private freeComponentIds:Set<EID> = new Set();
	private componentIds:Map<Component<any>, CID> = new Map();
	private componentFromId:Record<number, Component<any>> = {};
	private components:Record<CID, Record<EID, Object>> = {};

	public registerComponent<IInst extends Function>(component : Component<IInst>) {
		console.log("Registered", component);
		this.componentIds.set(component, this.componentIdIndex++);
		this.componentFromId[this.componentIds.get(component)!] = component;
		this.components[this.componentIds.get(component)!] = {};
	}

	public bindComponent<IInst extends (...args:any) => any> (
		eid:EID, 
		component : Component<IInst>,
		...args: Parameters<(typeof component)["instantiate"]>
	) {
		this.removeSignature(eid, this.entitySignatures[eid]);
		let cid:CID = this.componentIds.get(component)!;
		this.components[cid][eid] = component.instantiate(...(args as IterableIterator<unknown>));
		this.addSignature(eid, this.entitySignatures[eid] | 2 ** cid);
	}

	public unbindComponent<IInst extends (...args:any) => any>(
		eid: EID, 
		component: Component<IInst>
	) {
		this.removeSignature(eid, this.entitySignatures[eid]);
		let cid:CID = this.componentIds.get(component)!;
		delete this.components[cid][eid];
		this.addSignature(eid, this.entitySignatures[eid] & ((~0>>>1) - (2 ** cid)));
	}

	/***********
	 * SYSTEMS *
	 ***********/

	 private systemIdIndex = 0;
	 private freeSystemIds:Set<SID> = new Set();
	 private systemIds:Map<System<any>, SID> = new Map();
	 private systems:Record<SID, System<any>> = {};

	registerSystem(system : System<any>) {
		console.log("Registered", system);
		this.systemIds.set(system, this.systemIdIndex++);
		this.systems[this.systemIds.get(system)!] = system;
	}

	removeSystem(system : System<any>) {
		console.log("Removing", system);
		delete this.systems[this.systemIds.get(system)!];
		this.systemIds.delete(system);
	}

	updateSystems(){
		this.systemIds.forEach(id => {
			this.updateSystem(this.systems[id]);
		})
	}

	updateSystem(system : System<any>) {
		system.update!(1, this.getEntityObjectsMatchingSignature(this.constructSignature(...Object.values(system.components) as any)));
	}

	/*********************************
	 * SIGNATURE MATCHING / CACHEING *
	 *********************************/

	private signatureCache:Map<Signature, Set<EID>> = new Map();

	private getCachedSignaturesMatching(signature:Signature) {
		let matches = new Set<Signature>();

		this.signatureCache.forEach((val, sig) => {
			if(signature & sig) {
				matches.add(sig);
			}
		})

		return matches;
	}

	public removeSignature(eid:EID, sig:Signature) {
		this.getSystemsMatchingSignature(sig).forEach(sys => {
			if(sys.unbind){
				sys.unbind(this.getEntityAsObject(eid));
			}
		})

		this.signatureCache.get(sig)?.delete(eid);
	}

	public addSignature(eid:EID, sig:Signature) {
		this.entitySignatures[eid] = sig;

		if(!this.signatureCache.has(sig)) {
			this.signatureCache.set(sig, new Set([eid]));
		} else {
			this.signatureCache.get(sig)?.add(eid);
		}

		this.getSystemsMatchingSignature(sig).forEach(sys => {
			if(sys.bind){
				sys.bind(this.getEntityAsObject(eid));
			}
		})
	}

	private getEntitiesWithSignatures(signatures: Set<Signature>) {
		let entities:EID[] = [];

		signatures.forEach(sig => {
			entities.push(...this.signatureCache.get(sig)!.values())
		})

		return new Set(entities);
	}

	/*******************
	 * ENTITY QUERYING *
	 *******************/

	constructSignature(...components:Component<any>[]) {
		let sig:Signature = 0;

		components.forEach(comp => {
			sig |= 2 ** this.componentIds.get(comp)!;
		})

		return sig;
	}


	private getEntityAsObject(eid:EID) {
		let obj:any = {};

		decomposeBits(this.entitySignatures[eid]).forEach(cid => {
			obj[this.componentFromId[cid].name] = this.components[cid][eid];
		})

		return obj;
	}

	public getEntityObjectsMatchingSignature(signature:Signature) {
		let entities:Object[] = []
		let matchingSigs = this.getCachedSignaturesMatching(signature);
		let entitiyIds = this.getEntitiesWithSignatures(matchingSigs);

		entitiyIds.forEach(eid => {
			entities.push(this.getEntityAsObject(eid));
		})

		return entities;
	}

	public getSystemsMatchingSignature(signature:Signature) {
		let systems:System<any>[] = [];

		Object.values(this.systems).forEach(sys => {
			let sysSig = this.constructSignature(...Object.values(sys.components) as any);

			if( ((sysSig & signature) ==  sysSig) && signature != 0){
				systems.push(sys);
			}

		})
		return systems;
	}
}