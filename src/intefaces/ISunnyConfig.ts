/**
 * Interface representing the configuration object for the sunny portal API.
 * @date 24/10/2022 - 13:19:38
 *
 * @export
 * @interface ISunnyConfig
 * @typedef {ISunnyConfig}
 */
export interface ISunnyConfig {
	Login: {
		email: string;
		password: string;
	};
	General: {
		baseUrl: string;
	};
}
