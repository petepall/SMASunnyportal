// Generated by https://quicktype.io

export interface IEnergyBalanceInfiniteYear {
	"sma.sunnyportal.services": SMASunnyportalServices;
}

export interface SMASunnyportalServices {
	service: Service;
}

export interface Service {
	$: ServiceClass;
	data: Data;
}

export interface ServiceClass {
	name: string;
	method: string;
	version: string;
	"request-oid": string;
	"creation-date": string;
}

export interface Data {
	energybalance: EnergybalanceClass;
}

export interface EnergybalanceClass {
	$: Energybalance;
	infinite: InfiniteClass;
}

export interface Energybalance {
	unit: string;
}

export interface InfiniteClass {
	$: Infinite;
	year: YearClass;
}

export interface Infinite {
	timestamp: string;
}

export interface YearClass {
	$: Year;
}

export interface Year {
	timestamp: string;
	"battery-charging": string;
	"battery-discharging": string;
	"direct-consumption": string;
	"external-supply": string;
	"feed-in": string;
	"pv-generation": string;
	"self-consumption": string;
	"self-supply": string;
}


// Generated by https://quicktype.io

export interface IEnergyBalanceInfiniteYearTotal {
	"sma.sunnyportal.services": SMASunnyportalServices;
}

export interface Data {
	energybalancetotal: EnergybalancetotalClass;
}

export interface EnergybalancetotalClass {
	$: Energybalancetotal;
	infinite: Infinite;
}

export interface Energybalancetotal {
	unit: string;
}

export interface Infinite {
	$: { [key: string]: string; };
}
