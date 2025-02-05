import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import TermsAndConditions from '../../components/TermsAndConditions'
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button')
    }
  } 

  it('should render correct text', () => {
    const { heading, checkbox, button }  = renderComponent();

    expect(heading).toHaveTextContent('Terms & Conditions');
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  })

  it('should render button enabled when checkbox is checked', async () => {
    const { checkbox, button }  = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(button).toBeEnabled();
  })
})