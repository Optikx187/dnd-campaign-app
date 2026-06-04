import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RulesLawyer from '../RulesLawyer';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('RulesLawyer', () => {
  it('renders the component with title and input', () => {
    render(<RulesLawyer />);

    expect(screen.getByText('D&D 5e Rules Lawyer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask rules lawyer/i })).toBeInTheDocument();
  });

  it('disables button when textarea is empty', () => {
    render(<RulesLawyer />);
    const button = screen.getByRole('button', { name: /ask rules lawyer/i });
    expect(button).toBeDisabled();
  });

  it('enables button when question is entered', async () => {
    const user = userEvent.setup();
    render(<RulesLawyer />);

    await user.type(screen.getByPlaceholderText(/ask a question/i), 'How does sneak attack work?');

    const button = screen.getByRole('button', { name: /ask rules lawyer/i });
    expect(button).toBeEnabled();
  });

  it('displays the answer after a successful API call', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ answer: 'Sneak attack adds extra d6 dice to damage.' }),
    } as Response);

    const user = userEvent.setup();
    render(<RulesLawyer />);

    await user.type(screen.getByPlaceholderText(/ask a question/i), 'Sneak attack?');
    await user.click(screen.getByRole('button', { name: /ask rules lawyer/i }));

    await waitFor(() => {
      expect(screen.getByText('Sneak attack adds extra d6 dice to damage.')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));

    const user = userEvent.setup();
    render(<RulesLawyer />);

    await user.type(screen.getByPlaceholderText(/ask a question/i), 'test');
    await user.click(screen.getByRole('button', { name: /ask rules lawyer/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to get an answer/i)).toBeInTheDocument();
    });
  });
});
