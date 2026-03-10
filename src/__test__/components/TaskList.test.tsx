import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

function renderWithQuery(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>
  );
}

describe('TaskList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the add task form', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    renderWithQuery(<TaskList />);
    expect(screen.getByPlaceholderText('Add a new task…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('shows empty state when no tasks', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    ) as unknown as typeof fetch;

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument();
    });
  });

  it('displays tasks after loading', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: '1', title: 'Test Task', completed: false, userId: 'u1', createdAt: '', updatedAt: '' },
          ]),
      })
    ) as unknown as typeof fetch;

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    ) as unknown as typeof fetch;

    renderWithQuery(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks. Please refresh.')).toBeInTheDocument();
    });
  });

  it('disables Add button when input is empty', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    ) as unknown as typeof fetch;

    renderWithQuery(<TaskList />);

    await waitFor(() => screen.getByText('No tasks yet. Add one above!'));

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();
  });

  it('enables Add button when input has text', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    ) as unknown as typeof fetch;

    renderWithQuery(<TaskList />);

    await waitFor(() => screen.getByText('No tasks yet. Add one above!'));

    fireEvent.change(screen.getByPlaceholderText('Add a new task…'), {
      target: { value: 'New task' },
    });

    expect(screen.getByRole('button', { name: 'Add' })).not.toBeDisabled();
  });
});
