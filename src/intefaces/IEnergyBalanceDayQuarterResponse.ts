// Generated by https://quicktype.io

export interface IEnergyBalanceDayQuarter {
	'sma.sunnyportal.services': SMASunnyportalServices;
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
	'request-oid': string;
	'creation-date': string;
}

export interface Data {
	energybalance: EnergybalanceClass;
}

export interface EnergybalanceClass {
	$: Energybalance;
	day: DayClass;
}

export interface Energybalance {
	unit: string;
}

export interface DayClass {
	$: Day;
	fifteen: FifteenElement[];
}

export interface Day {
	timestamp: string;
}

export interface FifteenElement {
	$: Fifteen;
}

export interface Fifteen {
	timestamp: string;
	'battery-charging': string;
	'battery-discharging': string;
	'direct-consumption': string;
	'external-supply': string;
	'feed-in': string;
	'pv-generation': string;
	'self-consumption': string;
	'self-supply': string;
}
