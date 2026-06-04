import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  it('renders the login form with all fields', () => {
    render(<LoginForm onLogin={vi.fn()} />);

    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('renders the app title', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    expect(screen.getByText('D&D Campaign App')).toBeInTheDocument();
  });

  it('disables login button when fields are empty', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeDisabled();
  });

  it('enables login button when both fields have values', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password');

    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeEnabled();
  });

  it('calls onLogin with username and password on submit', async () => {
    const onLogin = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onLogin={onLogin} />);

    await user.type(screen.getByPlaceholderText('Enter your username'), 'hero');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'sword123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(onLogin).toHaveBeenCalledWith('hero', 'sword123');
  });

  it('does not submit when username is whitespace only', async () => {
    const onLogin = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onLogin={onLogin} />);

    await user.type(screen.getByPlaceholderText('Enter your username'), '   ');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'pass');

    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeDisabled();
  });

  it('shows demo disclaimer text', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    expect(screen.getByText(/demo purposes/i)).toBeInTheDocument();
  });
});
