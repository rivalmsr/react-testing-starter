import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import ProductList from '../../components/ProductList';
import AllProviders from '../AllProviders';
import { db } from '../mocks/db';
import { server } from '../mocks/server';

describe('ProductList', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    })
  })

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds }}})
  } )

  it('should render a product list', async () => {
    render(<ProductList />, { wrapper: AllProviders});

    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  })

  it('should render no product list when the product list is not found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));
    render(<ProductList />, { wrapper: AllProviders});

    const paragraph = await screen.findByText(/no products/i);
    expect(paragraph).toBeInTheDocument();
  })

  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()))
    render(<ProductList />, { wrapper: AllProviders});

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })

  it('should render a loading indicator when fetching api', async () => {
    server.use(http.get('/products', async () => {
      await delay();
      HttpResponse.json([])
    }));
    render(<ProductList />, { wrapper: AllProviders});

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  })

  it('should remove a loading indicator when fetched is successfuly', async () => {
    render(<ProductList />, { wrapper: AllProviders});

    await waitForElementToBeRemoved( () =>  screen.queryByText(/loading/i));
  })

  it('should remove a loading indicator when fetched is errors', async () => {
    server.use(http.get('/products', () => HttpResponse.error()))
    render(<ProductList />, { wrapper: AllProviders});

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })
})