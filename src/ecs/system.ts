import Query, { IQueryParams, QueryResult } from "./query";

interface ISystemMethods<C extends IQueryParams> {
	update?:(t:number, data: QueryResult<C> []) => void,
	bind?:(data: QueryResult<C>) => void,
	unbind?:(data: QueryResult<C>) => void
}

 export default class System<C extends IQueryParams> {
	constructor(
		public query: Query<C>,
		public methods: ISystemMethods<C>
	) {};
}