import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// A component that throws on demand
function BombComponent({ shouldThrow }) {
  if (shouldThrow) throw new Error('Test explosion!');
  return <div>All is well in Valhalla</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error from React's error boundary logging in tests
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    console.error.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/All is well in Valhalla/i)).toBeInTheDocument();
  });

  it('renders the error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/The Hall Has Fallen/i)).toBeInTheDocument();
  });

  it('displays the error message in the error UI', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Test explosion!/i)).toBeInTheDocument();
  });

  it('shows a reload button in the error UI', () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /Return to Valhalla/i })).toBeInTheDocument();
  });

  it('calls window.location.reload when the reload button is clicked', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: /Return to Valhalla/i }));
    expect(reloadMock).toHaveBeenCalledOnce();
  });
});
