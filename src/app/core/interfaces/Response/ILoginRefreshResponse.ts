export interface ILoginRefreshResponse {
	version: string;
	success: boolean;
	data: {
		JwtToken: string;
	};
	error: null;
}