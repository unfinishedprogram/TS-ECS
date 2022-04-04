export default abstract class IDdable {
	private _id = -1;

	setId(id:number){
		this._id = id; 
	}

	getId() {
		return this._id;
	}
}