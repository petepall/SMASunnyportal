// Generated by https://quicktype.io

export interface IEnergyBalanceYearMonth {
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
	year: YearClass;
}

export interface Energybalance {
	unit: string;
}

export interface YearClass {
	$: Year;
	month: MonthElement[];
}

export interface Year {
	timestamp: string;
}

export interface MonthElement {
	$: Month;
}

export interface Month {
	timestamp: string;
	"battery-charging"?: string;
	"battery-discharging"?: string;
	"direct-consumption"?: string;
	"external-supply"?: string;
	"feed-in"?: string;
	"pv-generation"?: string;
	"self-consumption"?: string;
	"self-supply"?: string;
}


// Generated by https://quicktype.io

export interface IEnergyBalanceYearMonthTotal {
	"sma.sunnyportal.services": SMASunnyportalServices;
}

export interface Data {
	energybalancetotal: EnergybalancetotalClass;
}

export interface EnergybalancetotalClass {
	$: Energybalancetotal;
	year: Year;
}

export interface Energybalancetotal {
	unit: string;
}

export interface Year {
	$: { [key: string]: string; };
}
