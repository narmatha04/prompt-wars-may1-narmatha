import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Helper component to test context values
function ThemeConsumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('toggles from light to dark when button is clicked', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Toggle/i }));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('toggles back to light from dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button');
    fireEvent.click(btn); // -> dark
    fireEvent.click(btn); // -> light
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('persists theme to localStorage on toggle', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(localStorage.getItem('valhalla-theme')).toBe('dark');
  });

  it('applies dark class to document root when theme is dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class from document root when theme is light', () => {
    document.documentElement.classList.add('dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    // Defaults to light, should remove dark class
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('valhalla-theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });
});
