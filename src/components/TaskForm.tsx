import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { IntervalUnit, TaskColor } from '@/types';
import { cn } from '@/lib/utils';

interface TaskFormProps {
    onAdd: (title: string, value: number, unit: IntervalUnit, color: TaskColor) => void;
}

const COLORS: { value: TaskColor; bg: string; border: string }[] = [
    { value: 'blue', bg: 'bg-blue-600', border: 'border-blue-400' },
    { value: 'green', bg: 'bg-green-600', border: 'border-green-400' },
    { value: 'purple', bg: 'bg-purple-600', border: 'border-purple-400' },
    { value: 'orange', bg: 'bg-orange-600', border: 'border-orange-400' },
    { value: 'pink', bg: 'bg-pink-600', border: 'border-pink-400' },
];

export function TaskForm({ onAdd }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [intervalValue, setIntervalValue] = useState(1);
    const [intervalUnit, setIntervalUnit] = useState<IntervalUnit>('minutes');
    const [selectedColor, setSelectedColor] = useState<TaskColor>('blue');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || intervalValue <= 0) return;
        onAdd(title, intervalValue, intervalUnit, selectedColor);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">新しいタスクを追加</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="例: 深呼吸をする"
                    className="p-3 border border-gray-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-white placeholder:text-gray-500 text-lg shadow-sm"
                    required
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-end justify-between">
                <div className="flex flex-wrap items-end gap-6">
                    {/* Interval Input */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-300">間隔</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={intervalValue}
                                onChange={e => setIntervalValue(parseInt(e.target.value) || 1)}
                                className="p-3 border border-gray-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 text-center text-white text-lg shadow-sm"
                                required
                            />
                            <select
                                value={intervalUnit}
                                onChange={e => setIntervalUnit(e.target.value as IntervalUnit)}
                                className="p-3 border border-gray-700 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base shadow-sm"
                            >
                                <option value="minutes">分おき</option>
                                <option value="hours">時間おき</option>
                                <option value="days">日おき</option>
                            </select>
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-gray-300">カラー</span>
                        <div className="flex items-center gap-3 p-1.5 bg-gray-800 rounded-lg border border-gray-700 h-[54px]">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                        color.bg,
                                        selectedColor === color.value
                                            ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                    title={color.value}
                                >
                                    {selectedColor === color.value && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 flex items-center justify-center shadow-md transition-colors w-full sm:w-auto min-w-[120px]"
                    aria-label="追加"
                >
                    <Plus size={28} />
                    <span className="ml-2 font-bold">追加</span>
                </button>
            </div>
        </form>
    );
}
