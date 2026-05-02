import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIAssistant from './AIAssistant';

// Mock the Gemini SDK with a proper class constructor
vi.mock('@google/generative-ai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    response: { text: () => 'Your top priority is: Design Database Schema (P1, Due Soon).' },
  });
  const mockGetGenerativeModel = vi.fn().mockReturnValue({ generateContent: mockGenerateContent });
  class MockGoogleGenerativeAI {
    constructor() {}
    getGenerativeModel = mockGetGenerativeModel;
  }
  return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

const mockTasks = [
  { id: '1', title: 'Design Database Schema', status: 'todo', owner: 'Alex', priority: 'P1', confidence: 'On Track', dueDate: new Date(Date.now() + 86400000).toISOString() },
  { id: '2', title: 'Configure Auth', status: 'blocked', owner: 'Sam', priority: 'P1', confidence: 'At Risk', dueDate: new Date(Date.now() + 864000000).toISOString() },
];

describe('AIAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the input field and ask button', () => {
    render(<AIAssistant tasks={mockTasks} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask/i })).toBeInTheDocument();
  });

  it('shows placeholder text when no response exists', () => {
    render(<AIAssistant tasks={mockTasks} />);
    expect(screen.getByText(/Ask the Oracle/i)).toBeInTheDocument();
  });

  it('displays loading state while waiting for response', async () => {
    // Override the mock to hang so we can test the loading state
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const mockModel = new GoogleGenerativeAI().getGenerativeModel();
    mockModel.generateContent.mockImplementationOnce(() => new Promise(() => {}));

    const user = userEvent.setup();
    render(<AIAssistant tasks={mockTasks} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'What are my blockers?');
    await user.click(screen.getByRole('button', { name: /ask/i }));
    // Loading text should briefly appear
    expect(screen.getByText(/Consulting the runes/i)).toBeInTheDocument();
  });

  it('renders AI response after form submission', async () => {
    const user = userEvent.setup();
    render(<AIAssistant tasks={mockTasks} />);
    await user.type(screen.getByRole('textbox'), 'What should I focus on?');
    await user.click(screen.getByRole('button', { name: /ask/i }));
    await waitFor(() => {
      expect(screen.getByText(/Design Database Schema/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when input is empty', () => {
    render(<AIAssistant tasks={mockTasks} />);
    expect(screen.getByRole('button', { name: /ask/i })).toBeDisabled();
  });

  it('clears input after submission', async () => {
    const user = userEvent.setup();
    render(<AIAssistant tasks={mockTasks} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'What are my blockers?');
    await user.click(screen.getByRole('button', { name: /ask/i }));
    await waitFor(() => expect(input).toHaveValue(''));
  });
});
