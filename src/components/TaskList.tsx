import { Task } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                <p>タスクがありません</p>
                <p className="text-sm mt-2">新しいタスクを追加してください</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
