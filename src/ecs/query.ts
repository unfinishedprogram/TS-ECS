import Component from "./component";
import Velocity from "@/components/velocity";

type Instanced<C extends Component<any>> = C extends Component<infer T> ? T : unknown;

export type QueryResult<Q extends IQueryParams> = {
	[P in keyof Q]: Instanced<Q[P]>;
}
export interface IQueryParams {
	[key:string]:Component<unknown>
}

export default class Query<T extends IQueryParams> {
	public componentIds:Set<number>;
	public bitMask:number = 0;

	constructor(components: T) {
		this.componentIds = new Set<number>();
		
		for (let comp in components) {
			this.componentIds.add(components[comp].id);
			this.bitMask |= 2 ** components[comp].id;
		}
	}
}
