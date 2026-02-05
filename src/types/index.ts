export type IntervalUnit = 'minutes' | 'hours' | 'days';
export type TaskColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink';

export interface Task {
    id: string;
    title: string;
    intervalValue: number;
    intervalUnit: IntervalUnit;
    color: TaskColor;
    nextNotificationAt: string; // ISO string
    completed: boolean;
    active: boolean; // Toggle for enabling/disabling reminders without deleting
}
