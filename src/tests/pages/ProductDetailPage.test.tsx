import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { Product } from "../../entities";
import { db } from "../mocks/db";
import { navigateTo } from "../utils";

describe('ProductDetailPage', () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  })

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } })
  })

  it('should render product detail page', async () => {
    navigateTo('/products/' + product.id);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i))
    expect(screen.getByRole('heading', { name: product.name }));
    expect(screen.getByText('$' + product.price));
  })
})
