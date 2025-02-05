import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToastDemo from '../../components/ToastDemo';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';


describe('ToastDemo', () => {
  it('should render toasts', async () => {
    render(<>
    <ToastDemo />
    <Toaster />
    </>)

    const button = screen.getByRole('button', { name: /show/i});
    const user = userEvent.setup();
    await user.click(button)

    const toasts = await screen.findByText(/success/i);
    expect(toasts).toBeInTheDocument();
  })
})