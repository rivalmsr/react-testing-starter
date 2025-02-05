import { render, screen } from '@testing-library/react'
import UserAccount from '../../components/UserAccount'
import { User } from '../../entities'

describe('UserAccount', () => {
  it('should render user name', () => {
    const user: User = {id: 1, name: 'Mosh'}
    render(<UserAccount user={user} />)

    const username = screen.getByText(/mosh/i)
    expect(username).toBeInTheDocument();
  })

  it('should render edit button when user is admin', () => {
    const user: User = {id: 1, name: 'Mosh', isAdmin: true}
    render(<UserAccount user={user} />)

    const button = screen.queryByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  })
  
  it('should not render edit button when user is not admin', () => {
    const user: User = {id: 1, name: 'Mosh', isAdmin: false}
    render(<UserAccount user={user} />)

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  })
})