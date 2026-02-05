import { Task, TaskColor } from '@/types';
import { Trash2, Clock, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const COLOR_STYLES: Record<TaskColor, {
    border: string;
    bg: string;
    text: string;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
}> = {
    blue: {
        border: 'border-blue-800', bg: 'bg-gray-900', text: 'text-blue-300',
        iconBg: 'bg-blue-900/30', iconText: 'text-blue-400',
        badgeBg: 'bg-blue-900/30', badgeText: 'text-blue-300'
    },
    green: {
        border: 'border-green-800', bg: 'bg-gray-900', text: 'text-green-300',
        iconBg: 'bg-green-900/30', iconText: 'text-green-400',
        badgeBg: 'bg-green-900/30', badgeText: 'text-green-300'
    },
    purple: {
        border: 'border-purple-800', bg: 'bg-gray-900', text: 'text-purple-300',
        iconBg: 'bg-purple-900/30', iconText: 'text-purple-400',
        badgeBg: 'bg-purple-900/30', badgeText: 'text-purple-300'
    },
    orange: {
        border: 'border-orange-800', bg: 'bg-gray-900', text: 'text-orange-300',
        iconBg: 'bg-orange-900/30', iconText: 'text-orange-400',
        badgeBg: 'bg-orange-900/30', badgeText: 'text-orange-300'
    },
    pink: {
        border: 'border-pink-800', bg: 'bg-gray-900', text: 'text-pink-300',
        iconBg: 'bg-pink-900/30', iconText: 'text-pink-400',
        badgeBg: 'bg-pink-900/30', badgeText: 'text-pink-300'
    },
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const [timeLeft, setTimeLeft] = useState('');
    const styles = COLOR_STYLES[task.color] || COLOR_STYLES.blue;

    useEffect(() => {
        if (!task.active) {
            setTimeLeft('停止中');
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const next = new Date(task.nextNotificationAt);
            const diff = next.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('まもなく通知');
                return;
            }

            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setTimeLeft(format(next, "M月d日 H:mm", { locale: ja }));
            } else if (diff > 60 * 60 * 1000) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`あと${hours}時間${mins}分`);
            } else {
                const mins = Math.floor(diff / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`あと${mins}分${secs}秒`);
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [task.nextNotificationAt, task.active]);

    const unitLabel =
        task.intervalUnit === 'minutes' ? '分' :
            task.intervalUnit === 'hours' ? '時間' : '日';

    return (
        <div className={cn(
            "flex items-center gap-3 p-4 bg-gray-900 rounded-lg shadow-sm border transition-all",
            styles.border,
            !task.active && "bg-gray-950 border-gray-800 opacity-60"
        )}>
            <button
                onClick={() => onToggle(task.id)}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors focus:outline-none shrink-0",
                    task.active ? styles.iconBg + " " + styles.iconText : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                )}
                title={task.active ? "一時停止する" : "再開する"}
            >
                {task.active ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="flex-1 min-w-0">
                <p className={cn("text-lg font-bold break-words leading-tight", !task.active ? "text-gray-500" : "text-white")}>
                    {task.title}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold border border-transparent",
                        task.active ? styles.badgeBg + " " + styles.badgeText : "bg-gray-800 text-gray-500"
                    )}>
                        {task.intervalValue}{unitLabel}おき
                    </span>
                    <span className={cn(
                        "flex items-center gap-1 text-sm font-bold",
                        !task.active ? "text-gray-600" : styles.text
                    )}>
                        <Clock size={16} />
                        {timeLeft}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onDelete(task.id)}
                className="text-gray-600 hover:text-red-400 p-2 focus:outline-none shrink-0 transition-colors"
                aria-label="削除"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
}
