import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExpandableText from '../../components/ExpandableText'
import userEvent from '@testing-library/user-event'


describe('ExpandableText', () => {
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const trancatedText = longText.substring(0, limit) + '...';

  it('should render full text if text is less than 255 characters', () => {
    const text = 'Short text';
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  })

  it('should truncate text if text is longer than 255 characters', () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(trancatedText)).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/more/i);
  })

  it('should expanted text if the button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const user = userEvent.setup();
    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  })

  it('should collapse text when Show Less button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole('button', { name: /less/i})
    await user.click(showLessButton);

    expect(screen.getByText(trancatedText)).toBeInTheDocument();
    expect(showLessButton).toHaveTextContent(/more/i)
  })
})