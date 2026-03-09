import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { TaskList } from '@/components/tasks/TaskList';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe('TaskList', () => {
  it('displays loading state initially', () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('displays tasks after loading', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: '1', title: 'Test Task', completed: false },
        ]),
      })
    ) as unknown as typeof fetch;

    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });
});