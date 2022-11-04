import { conn, token } from '../index.js';
import { LogoutRequest } from '../requests/BaseRequests.js';

/**
 * Function to logout from the Sunny Portal API.
 * @date 21/10/2022 - 20:17:53
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @returns {*}
 */
export async function logout(): Promise<void> {
	const request = new LogoutRequest(
		'authentication',
		'DELETE',
		conn,
		token
	);
	await request.logout();
}
