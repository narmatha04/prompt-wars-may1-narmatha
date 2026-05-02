import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock Firebase auth
vi.mock('./firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

// Mock ThemeContext
vi.mock('./context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }) => children,
}));

// Mock lazy-loaded AIAssistant
vi.mock('./components/AIAssistant/AIAssistant', () => ({
  default: () => <div data-testid="ai-assistant">AI Assistant Mock</div>,
}));

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
    const { onAuthStateChanged } = require('firebase/auth');
    // Never call the callback — simulate auth pending
    onAuthStateChanged.mockImplementation(() => () => {});
    render(<App />);
    expect(screen.getByRole('status', { name: /Loading Valhalla/i })).toBeInTheDocument();
  });

  it('shows LandingPage when user is not authenticated', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // no user
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /VALHALLA/i })).toBeInTheDocument();
    });
  });

  it('shows main app when user is authenticated', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Welcome back/i })).toBeInTheDocument();
    });
  });

  it('navigates to Task Board when nav button is clicked', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
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
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test/i)).toBeInTheDocument();
    });
  });

  it('has a skip to main content link for keyboard accessibility', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Skip to main content/i)).toBeInTheDocument();
    });
  });

  it('active nav item has aria-current="page"', async () => {
    const { onAuthStateChanged } = require('firebase/auth');
    onAuthStateChanged.mockImplementation((auth, callback) => {
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
