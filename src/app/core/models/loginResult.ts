export class LoginResult {
    success: boolean = false;
    mfaRequired: boolean = false;
    errorText?: string = undefined;

    constructor(success: boolean, mfaRequired: boolean, errorText?: string) {
        this.success = success;
        this.mfaRequired = mfaRequired;
        this.errorText = errorText;
    }
}