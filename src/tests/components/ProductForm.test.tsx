/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductForm from '../../components/ProductForm';
import { Category, Product } from '../../entities';
import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';

describe('ProductForm', () => {
  let category: Category;
  
  beforeAll(() => {
    category = db.category.create();
  })

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id }}});
  })

  it('should render form fields', async () => {
    const { waitForFormToLoad } = renderComponent();
    const inputs = await waitForFormToLoad();

    expect(inputs.nameInput).toBeInTheDocument();
    expect(inputs.priceInput).toBeInTheDocument();
    expect(inputs.categoryInput).toBeInTheDocument();
  });

  it('should populate form fields when editing a product', async () => {
    const product: Product = {
      id: 2,
      name: 'Test Product',
      price: 19.99,
      categoryId: category.id,
    }
    const { waitForFormToLoad } = renderComponent(product);
    const inputs = await waitForFormToLoad();
    
    expect(inputs.nameInput).toHaveValue(product.name);
    expect(inputs.priceInput).toHaveValue(product.price.toString());
    expect(inputs.categoryInput).toHaveTextContent(category.name);
  });

  it('should put focus on the name field', async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });

  it.each([
    { scenario: 'missing', errorMessage: /required/i },
    { scenario: 'longer than 255 character', name: 'a'.repeat(256), errorMessage: /255/ },
  ])('should display an error if name is $scenario', async ({ name, errorMessage}) => {
    const { waitForFormToLoad } = renderComponent();

    const form = await waitForFormToLoad();
    await form.fill({...form.validData, name });

    screen.debug();
    // expectErrorToBeInTheDocument(errorMessage);
    // const alert = screen.getByRole('alert');
    // expect(alert).toBeInTheDocument();
    // expect(alert).toHaveTextContent(errorMessage);
  })
  
  // it.each([
  //   { scenario: 'missing', errorMessage: /required/i },
  //   { scenario: '0', price: 0, errorMessage: /1/ },
  //   { scenario: 'negative', price: -1, errorMessage: /1/ },
  //   { scenario: 'not a number', price: 'a', errorMessage: /required/ },
  //   { scenario: 'greater than 1000', price: 1001, errorMessage: /1000/ },
  // ])('should display an error if price is $scenario', async ({ price, errorMessage }) => {
  //   const { waitForFormToLoad } = renderComponent();

  //   const form = await waitForFormToLoad();
  //   await form.fill({...form.validData, price});
  //   // expectErrorToBeInTheDocument(errorMessage);
  //   const alert = screen.getByRole('alert');
  //   expect(alert).toBeInTheDocument();
  //   expect(alert).toHaveTextContent(errorMessage);
  // })

  // it('should call onSubmit form with the correct data', async () => {
  //   const { waitForFormToLoad, onSubmit } = renderComponent();

  //   const form = await waitForFormToLoad();
  //   await form.fill(form.validData);

  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
  //   const { id, ...formData } = form.validData;
  //   expect(onSubmit).toHaveBeenCalledWith(formData);
  // })

  // it('should display a toast if submission is failed', async () => {
  //   const { waitForFormToLoad, onSubmit } = renderComponent();
  //   onSubmit.mockRejectedValue({});

  //   const form = await waitForFormToLoad();
  //   await form.fill(form.validData);

  //   const toast = await screen.findByRole('status');
  //   expect(toast).toBeInTheDocument();
  //   expect(toast).toHaveTextContent(/error/i);
  // })

  // it('should disabled the submit button upon submission', async () => {
  //   const { waitForFormToLoad, onSubmit } = renderComponent();
  //   onSubmit.mockReturnValue(new Promise(() => {}));

  //   const form = await waitForFormToLoad();
  //   await form.fill(form.validData);

  //   expect(form.submitButton).toBeDisabled();
  // })
  
  // it('should re-enabled the submit button after submission', async () => {
  //   const { waitForFormToLoad, onSubmit } = renderComponent();
  //   onSubmit.mockReturnValue({});

  //   const form = await waitForFormToLoad();
  //   await form.fill(form.validData);

  //   expect(form.submitButton).not.toBeDisabled();
  // })
  
  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();

    render(
    <>
      <ProductForm product={product} onSubmit={onSubmit}/>
      <Toaster />
    </>
    , { wrapper: AllProviders });

    return {
      onSubmit,

      expectErrorToBeInTheDocument : (errorMessage: RegExp) => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(errorMessage);
      } ,

      waitForFormToLoad: async () => {
        await screen.findByRole('form');

        const nameInput = screen.getByPlaceholderText( /name/i );
        const priceInput = screen.getByPlaceholderText( /price/i );
        const categoryInput = screen.getByRole('combobox', { name: /category/i });
        const submitButton = screen.getByRole('button');

        type FormData = {
          [K in keyof Product]: any
        }

        const validData: FormData = {
          id: 1,
          name: 'test',
          price: 10,
          categoryId: category.id,
        }

        const fill = async (product: FormData) => {
          const user = userEvent.setup();

          if (product.name !== undefined) 
            await user.type(nameInput, product.name);

          if (product.price !== undefined)
            await user.type(priceInput, product.price.toString());

          await user.tab();
          await user.click(categoryInput);
          const options = screen.getAllByRole('option');
          await user.click(options[0]);
          await user.click(submitButton);
        }

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill,
          validData
        }
      }, 
    }
  };
});