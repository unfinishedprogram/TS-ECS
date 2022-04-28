export type TrackableStat = [string, () => any];

export default class StatsWindow {
	private containerElm:HTMLDivElement = document.createElement("div");
	private valueElms:{[index:string]:HTMLElement} = {};
	private statValues: {[index:string]:any} = {};

	public constructor() {
		this.containerElm.classList.add("tracker-container");
		document.body.appendChild(this.containerElm);
	}

	public setStat(label:string, value:any) {
		if(!Object.keys(this.statValues).includes(label)){
			this.createTrackerElm(label);
		}

		this.statValues[label] = value;
	}

	public updateDisplay():void {
		for(let label in this.statValues) {
			this.valueElms[label].textContent = this.statValues[label];
		}
	}

	private createTrackerElm(label:string):HTMLElement {
		let valueElement = document.createElement("span");
		let labelElement = document.createElement("span");
		let separatorElement = document.createElement("span");

		separatorElement.textContent = " : ";

		valueElement.classList.add(`${label}-value`, "value");
		labelElement.classList.add(`${label}-label`, "label");
		labelElement.textContent = label;

		this.containerElm.appendChild(labelElement);
		this.containerElm.appendChild(separatorElement);
		this.containerElm.appendChild(valueElement);

		this.valueElms[label] = valueElement;

		return valueElement;
	}
}
