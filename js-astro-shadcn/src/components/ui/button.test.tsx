import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant='destructive'>Destructive Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies correct size classes', () => {
    render(<Button size='lg'>Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'px-6');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('accepts custom className', () => {
    render(<Button className='custom-class'>Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
