export interface IToken {
	secret_key: string;
	identifier: string;
}

export interface IPlantList {
	plantname: string;
	plantoid: string;
}

export interface IPlantProfile {
	plantHeader: {
		plantname: string;
		peakpower: number;
		powerunit: string;
		location: string;
		startData: string;
		description: string;
		plantImage: string;
		plantImageHight: number;
		plantImageWidth: number;
	};
	expectedPlantProduction: {
		expectedYield: string;
		expectedYieldUnit: string;
		expectedCO2Reduction: string;
		expectedCO2ReductionUnit: string;
	};
	modules: {
		moduleName: string;
		numerOfModules: number;
		alignment: number;
		gradient: number;
	};
	inverters: {
		inverterName: string;
		numberOfInverters: number;
		icon: string;
	};
	communicationProducts: {
		communicationProductName: string;
		numberOfCommunicationProducts: number;
		icon: string;
	};
}
