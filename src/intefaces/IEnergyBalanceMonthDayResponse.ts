// Generated by https://quicktype.io

export interface IEnergyBalanceMonthDay {
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
	month: MonthClass;
}

export interface Energybalance {
	unit: string;
}

export interface MonthClass {
	$: Month;
	day: DayElement[];
}

export interface Month {
	timestamp: string;
}

export interface DayElement {
	$: Day;
}

export interface Day {
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

export interface IEnergyBalanceMonthDayTotal {
	"sma.sunnyportal.services": SMASunnyportalServices;
}

export interface Data {
	energybalancetotal: EnergybalancetotalClass;
}

export interface EnergybalancetotalClass {
	$: Energybalancetotal;
	month: Month;
}

export interface Energybalancetotal {
	unit: string;
}

export interface Month {
	$: { [key: string]: string; };
}