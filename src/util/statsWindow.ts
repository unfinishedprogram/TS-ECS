export type TrackableStat = [string, () => any];

export default class StatsWindow {
	private containerElm:HTMLDivElement = document.createElement("div");
	private valueElms:{[index:string]:HTMLElement} = {};
	private statValues: {[index:string]:any} = {};
	private interval;
	
	public static instance = new StatsWindow();

	private constructor(updateInterval:number = 100) {
		this.containerElm.classList.add("tracker-container");
		document.body.appendChild(this.containerElm);

		this.interval = setInterval(() => this.updateDisplay(), updateInterval);
	}

	set updateInterval(updateInterval:number) {
		clearInterval(this.interval);
		this.interval = setInterval(() => this.updateDisplay(), updateInterval);
	}

	public setStat(label:string, value:any) {
		if(!Object.keys(this.statValues).includes(label)){
			this.createTrackerElm(label);
		}

		this.statValues[label] = value;
	}

	private updateDisplay():void {
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
