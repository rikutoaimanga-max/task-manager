import { useState, useEffect, useCallback } from 'react';
import { Task, IntervalUnit, TaskColor } from '@/types';
import { useNotifications } from './useNotifications';

// Calculate next notification time based on interval
const calculateNextTime = (value: number, unit: IntervalUnit, fromTime?: Date): Date => {
    const base = fromTime || new Date();
    const next = new Date(base);

    switch (unit) {
        case 'minutes':
            next.setMinutes(next.getMinutes() + value);
            break;
        case 'hours':
            next.setHours(next.getHours() + value);
            break;
        case 'days':
            next.setDate(next.getDate() + value);
            break;
    }

    return next;
};

export const useTaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { sendNotification } = useNotifications();
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tasks', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    // Check for notifications and update next time
    useEffect(() => {
        if (!isLoaded) return;

        const checkReminders = () => {
            const now = new Date();
            let hasUpdates = false;

            const updatedTasks = tasks.map(task => {
                // If task is completed or not active, skip
                if (task.completed || !task.active) return task;

                const scheduledTime = new Date(task.nextNotificationAt);

                if (scheduledTime <= now) {
                    // Send notification
                    sendNotification(`時間です: ${task.title}`, {
                        body: `${task.intervalValue}${task.intervalUnit === 'minutes' ? '分' :
                                task.intervalUnit === 'hours' ? '時間' : '日'
                            }経過しました。`,
                        tag: task.id
                    });

                    // Schedule next notification
                    const nextTime = calculateNextTime(task.intervalValue, task.intervalUnit);

                    hasUpdates = true;
                    return { ...task, nextNotificationAt: nextTime.toISOString() };
                }
                return task;
            });

            if (hasUpdates) {
                setTasks(updatedTasks);
            }
        };

        const timer = setInterval(checkReminders, 5000); // Check every 5 seconds
        return () => clearInterval(timer);
    }, [tasks, isLoaded, sendNotification]);

    const addTask = useCallback((title: string, intervalValue: number, intervalUnit: IntervalUnit, color: TaskColor) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            intervalValue,
            intervalUnit,
            color,
            nextNotificationAt: calculateNextTime(intervalValue, intervalUnit).toISOString(),
            completed: false,
            active: true,
        };
        setTasks(prev => [...prev, newTask].sort((a, b) => new Date(a.nextNotificationAt).getTime() - new Date(b.nextNotificationAt).getTime()));
    }, []);

    const toggleTask = useCallback((id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            // When re-enabling (from completed/inactive to active), reset the timer from NOW
            if (!t.active) {
                const nextTime = calculateNextTime(t.intervalValue, t.intervalUnit);
                return { ...t, active: true, completed: false, nextNotificationAt: nextTime.toISOString() };
            }
            // Toggle active state
            return { ...t, active: !t.active };
        }));
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    return { tasks, addTask, toggleTask, deleteTask, isLoaded };
};
