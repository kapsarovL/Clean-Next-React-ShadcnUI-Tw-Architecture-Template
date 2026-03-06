import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
        <TaskList />
      </div>
    </ProtectedRoute>
  );
}