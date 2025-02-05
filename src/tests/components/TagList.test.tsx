import { it, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import TagList from '../../components/TagList'

describe('TagList', () => {
  it('should render tag list', async () => {
    render(<TagList />);
   
    // first way
    // waitFor(() => {
    //   const listItems = screen.getAllByRole('listitem');
    //   expect(listItems.length).toBeGreaterThan(0);
    // })

    // second way
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  })
})