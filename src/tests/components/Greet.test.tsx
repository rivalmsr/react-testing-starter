import { render, screen } from '@testing-library/react'
import Greet from '../../components/Greet'

describe('Greet', () => {
  it('should return Hello with name when name is provided', () => {
   render(<Greet name="Mosh" />)

   const heading = screen.getByRole('heading')
   
   expect(heading).toBeInTheDocument();
   expect(heading).toHaveTextContent(/mosh/i);
  })

  it('should return login when name is not provided', () => {
    render(<Greet/>)
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  })

})