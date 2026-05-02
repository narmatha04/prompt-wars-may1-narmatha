import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// vi.hoisted ensures these are available when vi.mock factories run
const { mockOnAuthStateChanged, mockSignOut } = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn(),
  mockSignOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mockOnAuthStateChanged,
  signOut: mockSignOut,
}));

vi.mock('./context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }) => children,
}));

vi.mock('./components/AIAssistant/AIAssistant', () => ({
  default: () => <div data-testid="ai-assistant">AI Assistant Mock</div>,
}));

import App from './App';

const mockUser = {
  uid: 'test-uid',
  displayName: 'Test Warrior',
  email: 'warrior@valhalla.com',
  photoURL: null,
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while auth state is resolving', () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {});
    render(<App />);
    expect(screen.getByRole('status', { name: /Loading Valhalla/i })).toBeInTheDocument();
  });

  it('shows LandingPage when user is not authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /VALHALLA/i })).toBeInTheDocument();
    });
  });

  it('shows main app when user is authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();
    });
  });

  it('navigates to Task Board when nav button is clicked', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() => screen.getByRole('button', { name: /Task Board/i }));
    await user.click(screen.getByRole('button', { name: /Task Board/i }));
    expect(screen.getByRole('heading', { name: /Platform Development MVP/i })).toBeInTheDocument();
  });

  it('displays user display name in welcome message', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test/i)).toBeInTheDocument();
    });
  });

  it('has a skip to main content link for keyboard accessibility', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Skip to main content/i)).toBeInTheDocument();
    });
  });

  it('active nav item has aria-current="page"', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      const commandCenterBtn = screen.getByRole('button', { name: /Command Center/i });
      expect(commandCenterBtn).toHaveAttribute('aria-current', 'page');
    });
  });
});
