import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from './LandingPage';

// Mock Firebase auth
vi.mock('../../firebase', () => ({
  auth: {},
  googleProvider: {},
}));
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: '123', displayName: 'Test User' } }),
}));

// Mock ThemeContext
vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

describe('LandingPage', () => {
  it('renders the VALHALLA heading', () => {
    render(<LandingPage />);
    expect(screen.getByRole('heading', { name: /VALHALLA/i })).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Coordinate\. Conquer\./i)).toBeInTheDocument();
  });

  it('renders the Google Sign-In button', () => {
    render(<LandingPage />);
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Enter the grand hall/i)).toBeInTheDocument();
  });

  it('shows loading state while signing in', async () => {
    const { signInWithPopup } = await import('firebase/auth');
    // Make signInWithPopup hang so we can observe the loading state
    signInWithPopup.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<LandingPage />);
    const btn = screen.getByRole('button', { name: /Sign in with Google/i });
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('button has correct aria-label for accessibility', () => {
    render(<LandingPage />);
    const btn = screen.getByRole('button', { name: /Sign in with Google/i });
    expect(btn).toHaveAttribute('aria-label', 'Sign in with Google');
  });

  it('renders inside a main landmark', () => {
    render(<LandingPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
