import Component from "./component"

interface ISystemComponents {
	[index:string] : Component<(...args:any) => any>;
}

type InstancedComponents<TComps extends ISystemComponents> = {
	[Comp in keyof TComps] : ReturnType<TComps[Comp]["instantiate"]>;
}

interface IUpdateFunction<T extends ISystemComponents> {
	(t:number, data:IterableIterator<InstancedComponents<T>>):void;
}

interface IBindFunction<T extends ISystemComponents> {
	(data:InstancedComponents<T>):void;
}
interface IUnbindFunction<T extends ISystemComponents> {
	(data:InstancedComponents<T>):void;
}

 export default class System<C extends ISystemComponents>{	
	constructor (
		public components:C,
		public update?: IUpdateFunction<C>,
		public bind?:IBindFunction<C>,
		public unbind?:IUnbindFunction<C>
	){}
}