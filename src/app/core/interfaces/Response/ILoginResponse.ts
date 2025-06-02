export interface ILoginResponse {
    version: string;
    success: boolean;
    data: {
        JwtToken: string;
        RefreshToken: string;
        FirstName: string;
        LastName: string;
    };
    error: string | null;
}