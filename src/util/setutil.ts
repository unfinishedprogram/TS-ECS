export function setsEqual<T>(a:Set<T>, b:Set<T>):boolean {
	if(a.size != b.size)  return false;
	for(let val of a.values()){
		if(!b.has(val)){
			return false;
		}
	}
	return true;
}