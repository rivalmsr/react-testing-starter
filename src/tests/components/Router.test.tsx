import { screen, waitForElementToBeRemoved } from "@testing-library/react"
import { navigateTo } from "../utils"
import { db } from "../mocks/db";
import { Product } from "../../entities";

describe('Router', () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  })

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } })
  })

  it.each([
    { title: 'home', path: '/' },
    { title: 'products', path: '/products' },
  ])('should render the $title page for path $path', ({ title, path }) => {
    navigateTo(path);

    expect(screen.getByRole('heading', { name: new RegExp(title, 'i') })).toBeInTheDocument();
  })

  it('should render the product detail page for path /products/:id', async () => {
    navigateTo('/products/' + product.id);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    expect(screen.getByRole('heading', { name: product.name }));
  })

  it('should render the not found page for invalid path', () => {
    navigateTo('/game');

    expect(screen.getByRole('heading', { name: /oops/i }));
  })

  it('should render the admin page for invalid path /admin', () => {
    navigateTo('/admin');

    expect(screen.getByRole('heading', { name: /admin/i }));
  })

})
