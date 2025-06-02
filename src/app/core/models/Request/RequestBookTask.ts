export interface RequestBookTask {
    subscriptionId: number | null;
    isRemote: boolean;
    gender: boolean;
    title: string;
    firstName: string;
    lastName: string;
    street: string;
    number: string;
    zip: string;
    city: string;
    phone: string;
    email: string;
    orderTimes: {
        from: string;
        to: string;
    }[];
    additionalTask: {
        skillIds: number[];
        description: string;
    } | null;
    customerNotification: number;
    customerNotificationPhoneNumber: string;

    // Only requiredn when isKulanz is true
    goodwillInfo?: {
        salcusId: string;
        reasonForGoodwill: string;
    };

    // Only required for Employee Bookings (Not Build Yet)
    employeeInfo?: {
        username: string;
    },

    businessCustomerInfo?: {
        billingEmail: string;
        companyName: string;
        contactPerson: string;
        ust: boolean;
        uid?: string; // Only required when ust is true
    }
}