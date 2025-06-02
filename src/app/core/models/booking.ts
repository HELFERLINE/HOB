import { serviceOptions } from "./serviceOptions";

export interface Address {
    salutation: string;
    title?: string;
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    // B2B specific fields
    companyName?: string;
    contactPerson?: string;
    billingEmail?: string;
    vatRequired?: string;
    uid?: string;
}

export interface ContactDetails {
    phoneNumber: string;
    email: string;
}

export interface AppointmentSuggestion {
    date: Date;
    startTime: Date;
    endTime: Date;
}

export class Booking {
    isKulanz: boolean = false;
    isB2B: boolean = false;
    isEmployee: boolean = false;
    salcusId?: string;
    kulanzReason?: string;
    selectedService: serviceOptions = serviceOptions.unselected;
    address?: Address;
    city?: string; // This is only for the first step of the Booking -> Its not used in the final booking
    postalCode?: string; // This is only for the first step of the Booking -> Its not used in the final booking
    contactDetails?: ContactDetails;
    appointmentSuggestions?: AppointmentSuggestion[];

    activationDate: Date | null | undefined = undefined;
    contactType: number = 0; // 0 = sms, 1 = phone

    subscriptionId: number | null = null;

    // Add new properties for expert help
    needsExpertHelp: boolean = false;
    selectedDeviceIds?: number[];
    printerDetails?: {
        deviceIds: string[];
        description: string;
    };

    // Store the username of the logged-in employee
    employeeUsername?: string;
}