export interface ResponseActivationDate {
    version: string;
    success: boolean;
    data: {
        subscriptionId: number | null;
        activationDate: string;
    };
    error: null | {
        code?: string;
        message?: string;
    };
}
