import { NotificationSeverity } from "../models/notificationSeverity";

export interface INotification {
    severity: NotificationSeverity;
    message: string;
    title: string;
    duration: number;
    isModal: boolean;
    primaryCallback?: () => void;
    primaryButtonLabel?: string;
    secondaryCallback?: () => void;
    secondaryButtonLabel?: string;
}