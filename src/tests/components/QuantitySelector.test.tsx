import { render, screen } from '@testing-library/react'
import QuantitySelector from '../../components/QuantitySelector'
import { Product } from '../../entities'
import AllProviders from '../AllProviders'
import userEvent from '@testing-library/user-event'

describe('QuantitySelector', () => {
  const product: Product = {
    id: 1,
    categoryId: 2,
    name: 'Monitor LED',
    price: 20
  }

  it('should render button with Add to cart text', () => {
    const { expectAddToCartToBeInTheDocument } = renderComponent();

    expectAddToCartToBeInTheDocument();
  })

  it('should render increment and decrement buttons with quantity equal 1', async () => {
    const { userClickedAddToCart } = renderComponent();
    const { expectAddToCartNotToBeInTheDocument, decrementButton, incrementButton, expectQuantityToHaveContext } = await userClickedAddToCart();

    expectAddToCartNotToBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expectQuantityToHaveContext('1')
  })

  it('should render quantity 2 after user click increment button', async () => {
    const { userClickedAddToCart, user } = renderComponent();
    const { incrementButton, expectQuantityToHaveContext } = await userClickedAddToCart();

    await user.click(incrementButton);
    expectQuantityToHaveContext('2')
  })

  it('should render quantity 1 after user click decrement button', async () => {
    const { userClickedAddToCart, user } = renderComponent();
    const { incrementButton, decrementButton, expectQuantityToHaveContext } = await userClickedAddToCart();

    await user.click(incrementButton);
    await user.click(decrementButton);
    expectQuantityToHaveContext('1')
  })

  it('should render add to cart button if quantity equal 0', async () => {
    const { userClickedAddToCart, user, expectAddToCartToBeInTheDocument } = renderComponent();
    const { decrementButton } = await userClickedAddToCart();

    await user.click(decrementButton);
    expectAddToCartToBeInTheDocument();
  })

  const renderComponent = () => {

    render(<QuantitySelector product={product} />, { wrapper: AllProviders })

    const user = userEvent.setup();

    const getAddToCart = () => screen.queryByRole('button', { name: /add/i });

    const expectAddToCartToBeInTheDocument = () => {
      expect(getAddToCart()).toBeInTheDocument();
    }

    const expectAddToCartNotToBeInTheDocument = () => {
      expect(getAddToCart()).not.toBeInTheDocument();
    }

    const expectQuantityToHaveContext = (text: string) => {
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(text);
    }

    const userClickedAddToCart = async () => {
      await user.click(getAddToCart()!);

      return {
        expectAddToCartNotToBeInTheDocument,
        decrementButton: screen.getByRole('button', { name: /-/i }),
        incrementButton: screen.getByRole('button', { name: /\+/i }),
        expectQuantityToHaveContext,
      }
    }

    return {
      user,
      userClickedAddToCart,
      expectAddToCartToBeInTheDocument,
    }
  }

})

