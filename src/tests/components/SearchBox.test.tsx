import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import SearchBox from '../../components/SearchBox'
import userEvent from '@testing-library/user-event'


describe('SearchBox', () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange
    }
  }

  it('should render input field', async () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  })

  it('should call on-change when enter is pressed', async () => {
    const { input, user, onChange } = renderSearchBox();

    const textInput = 'SearchText'
    await user.type(input, textInput + '{enter}')

    expect(onChange).toHaveBeenCalledWith(textInput);
  })

  it('should not call on-change when input field empty', async () => {
    const { input, user, onChange } = renderSearchBox();

    await user.type(input, '{enter}');

    expect(onChange).not.toHaveBeenCalled();
  })

})