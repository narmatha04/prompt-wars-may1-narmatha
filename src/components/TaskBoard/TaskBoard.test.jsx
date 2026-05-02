import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskBoard from './TaskBoard';

// Mock firebase to avoid initialization errors in tests
vi.mock('../../firebase', () => ({
  auth: {},
  db: {},
}));

describe('TaskBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all four kanban columns', () => {
    render(<TaskBoard />);
    expect(screen.getByRole('listitem', { name: /to do column/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /in progress column/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /blocked column/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /done column/i })).toBeInTheDocument();
  });

  it('renders the board heading', () => {
    render(<TaskBoard />);
    expect(screen.getByRole('heading', { name: /Platform Development MVP/i })).toBeInTheDocument();
  });

  it('renders initial tasks in the correct columns', () => {
    render(<TaskBoard />);
    expect(screen.getByRole('article', { name: /Design Database Schema/i })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: /Set up GitHub Actions/i })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: /Configure Firebase Auth/i })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: /Write MVP Spec/i })).toBeInTheDocument();
  });

  it('adds a new task to the To Do column when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    const input = screen.getByLabelText(/Enter new task title/i);
    const addButton = screen.getByRole('button', { name: /Add task/i });

    await user.type(input, 'My Brand New Quest');
    await user.click(addButton);

    expect(screen.getByRole('article', { name: /My Brand New Quest/i })).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('does not add an empty task', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    const taskCountBefore = screen.getAllByRole('article').length;
    const addButton = screen.getByRole('button', { name: /Add task/i });
    await user.click(addButton);
    expect(screen.getAllByRole('article').length).toBe(taskCountBefore);
  });

  it('shows a deadline alert badge for tasks due within 48 hours', () => {
    render(<TaskBoard />);
    // "Design Database Schema" is set with dueDate = now + 24 hours (within 48h)
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    expect(alerts[0]).toHaveTextContent(/due soon/i);
  });

  it('moves a task to the next column when forward arrow is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    // "Design Database Schema" is in 'todo' — move it forward
    const moveBtn = screen.getByRole('button', { name: /Move task "Design Database Schema" to next column/i });
    await user.click(moveBtn);
    const inProgressCol = screen.getByRole('listitem', { name: /in progress column/i });
    expect(within(inProgressCol).getByRole('article', { name: /Design Database Schema/i })).toBeInTheDocument();
  });

  it('has accessible form with label for input', () => {
    render(<TaskBoard />);
    expect(screen.getByLabelText(/Enter new task title/i)).toBeInTheDocument();
  });
});
