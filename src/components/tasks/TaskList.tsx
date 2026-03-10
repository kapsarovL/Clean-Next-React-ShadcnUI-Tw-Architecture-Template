'use client';

import { useState } from 'react';
import { useTasks, useCreateTask, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function TaskSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 flex justify-between items-center">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const [title, setTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    createTask.mutate(trimmed, { onSuccess: () => setTitle('') });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task…"
          disabled={createTask.isPending}
        />
        <Button type="submit" disabled={createTask.isPending || !title.trim()}>
          {createTask.isPending ? 'Adding…' : 'Add'}
        </Button>
      </form>

      {isLoading && <TaskSkeleton />}

      {error && (
        <p className="text-sm text-destructive">Failed to load tasks. Please refresh.</p>
      )}

      {!isLoading && !error && tasks?.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No tasks yet. Add one above!
        </p>
      )}

      <div className="space-y-2">
        {tasks?.map((task) => (
          <Card key={task.id} className="p-4 flex justify-between items-center">
            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
              {task.title}
            </span>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteTask.isPending}
              onClick={() => deleteTask.mutate(task.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
