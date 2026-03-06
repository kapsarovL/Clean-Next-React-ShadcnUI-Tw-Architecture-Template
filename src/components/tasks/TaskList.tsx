'use client';

import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();
  const deleteTask = useDeleteTask();

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="space-y-2">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4 flex justify-between items-center">
          <span>{task.title}</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteTask.mutate(task.id)}
          >
            Delete
          </Button>
        </Card>
      ))}
    </div>
  );
}