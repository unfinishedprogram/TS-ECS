import { decomposeBits } from "@/util/bitwise";
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
		let cid:CID = this.componentIds.get(component)!;

		this.components[cid][eid] = component.instantiate(args);
		this.entitySignatures[eid] |= 2 ** cid;
	}

	public unbindComponent<IInst extends (...args:any) => any>(
		eid: EID, 
		component: Component<IInst>
	) {
		let cid:CID = this.componentIds.get(component)!;
		delete this.components[cid][eid];
		this.entitySignatures[eid] &= ((~0>>>1) - (2 ** cid));
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

	/*********************************
	 * SIGNATURE MATCHING / CACHEING *
	 *********************************/

	private cachedSignatures:Set<Signature> = new Set();
	private signatureCache:Map<Signature, Set<EID>> = new Map();

	private getCachedSignaturesMatching(signature:Signature) {
		
		let matches = new Set<Signature>();

		this.cachedSignatures.forEach(sig => {
			if(signature & sig) {
				matches.add(sig);
			}
		})

		return matches;
	}

	private getEntitiesWithSignatures(signatures: Set<Signature>) {
		let entities:EID[] = [];

		signatures.forEach(sig => {
			entities.push(...this.signatureCache.get(sig)!.values())
		})

		return new Set(entities);
	}
}