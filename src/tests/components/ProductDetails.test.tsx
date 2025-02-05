import { it, expect, describe } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import ProductDetail from '../../components/ProductDetail';
// import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import { db } from '../mocks/db';
import AllProviders from '../AllProviders';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create()
      productId = product.id;
    });
  })

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId}}})
  })

  it('should render a product detail', async () => {
    const product = db.product.findFirst({ where: { id: { equals: productId }}});
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});

    expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
  })

  it('should render not found message when product is not exist', async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.json(null)));
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});

    const errorMessage = await screen.findByText(/not found/i);
    expect(errorMessage).toBeInTheDocument();
  })

  it('should render error message when api return errors message', async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders});

    const errorMessage = await screen.findByText(/invalid/i);
    expect(errorMessage).toBeInTheDocument();
  })

  it('should render an error message when there is an error', async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })

  it('should render a loading indicator when fetching product detail', async () => {
    server.use(http.get(`/products/${productId}`, async () => {
      await delay();
      HttpResponse.json(null)
    }));
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  })

  it('should remove a loading indicator after fetched product detail is successfully', async () => {
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })

  it('should remove a loading indicator after fetched product detail is errors', async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders});
    
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })
})