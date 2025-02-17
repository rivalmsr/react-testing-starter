import { render, screen } from "@testing-library/react"
import AuthStatus from "../../components/AuthStatus"
import { mockAuthState } from "../utils"
import { User } from "@auth0/auth0-react";

describe('AuthStatus', () => {

  it('should render the loading message while fetching the auth status', () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    })

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the login button if the user not authenticated', () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    })

    render(<AuthStatus />);

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  it('should render a username if the user authenticated', () => {
    const user: User = {
      name: 'Mosh Programming'
    }

    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user,
    })

    render(<AuthStatus />);

    expect(screen.getByText('Mosh Programming')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
  });
})
