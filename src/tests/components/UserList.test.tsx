import { render, screen } from '@testing-library/react'
import UserList from '../../components/UserList'
import { User } from '../../entities'

describe('UserList', () => {
  it('should render no users available when users is empty', () => {
    render(<UserList users={[]} />)

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  })

  it('should render users list', () => {
    const users: User[] = [
      {id: 1, name: 'Mosh'},
      {id: 2, name: 'John'},
    ];

    render(<UserList users={users} />);

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name});
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    })
  })
})