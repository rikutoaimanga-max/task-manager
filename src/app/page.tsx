'use client';

import { useTaskManager } from '@/hooks/useTaskManager';
import { useNotifications } from '@/hooks/useNotifications';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Bell, BellOff } from 'lucide-react';

export default function Home() {
  const { tasks, addTask, toggleTask, deleteTask, isLoaded } = useTaskManager();
  const { permission, requestPermission } = useNotifications();

  if (!isLoaded) {
    return null; // or loading spinner
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto p-4 md:p-8 pb-20 bg-black text-white">
      <header className="flex flex-col items-center justify-center mb-8 py-6 relative">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">ToDoリマインダー</h1>
        <div className="absolute right-0 flex items-center gap-2">
          <button
            onClick={() => {
              console.log('Test notification clicked');
              if (Notification.permission === 'granted') {
                new Notification('テスト通知', { body: '通知機能は正常に動作しています！' });
              } else {
                alert('通知が許可されていません。ベルのアイコンを押してください。');
              }
            }}
            className="px-3 py-2 bg-gray-800 text-xs text-gray-300 rounded hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            テスト通知
          </button>
          <button
            onClick={requestPermission}
            className="p-3 rounded-full bg-gray-900 shadow-sm border border-gray-800 hover:bg-gray-800 transition-colors"
            title={permission === 'granted' ? '通知許可済み' : '通知を許可する'}
          >
            {permission === 'granted' ?
              <Bell className="text-blue-400" size={24} /> :
              <BellOff className="text-gray-500" size={24} />
            }
          </button>
        </div>
      </header>

      <TaskForm onAdd={addTask} />

      <div className="mt-10">
        <h2 className="text-base font-bold text-gray-400 mb-4 px-1 flex items-center gap-2">
          登録中のタスク <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => t.active).length}</span>
        </h2>
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </div>

      <footer className="mt-16 text-center text-sm font-medium text-gray-600">
        <p>💡 ブラウザを開いたままにして通知を受け取ってください</p>
      </footer>
    </main>
  );
}
