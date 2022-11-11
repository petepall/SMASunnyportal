export interface IEnergyBalanceInfiniteYear {
	energyUnit: string;
	year: {
		timestamp: string;
		batteryCharging: number;
		batteryDischarging: number;
		directConsumption: number;
		externalSupply: number;
		gridFeedIn: number;
		generatedEnergy: number;
		selfConsumption: number;
		selfSupply: number;
	};
}

export interface IEnergyBalanceInfiniteYearTotal {
	energyUnit: string;
	year: {
		timestamp: string;
		autarkyRatio: number;
		batteryCharging: number;
		batteryDischarging: number;
		totalConsumption: number;
		directConsumption: number;
		externalSupply: number;
		gridFeedIn: number;
		generatedEnergy: number;
		directConsumptionRatio: number;
		selfConsumptionRatio: number;
		selfConsumption: number;
		selfSupply: number;
	};
}
