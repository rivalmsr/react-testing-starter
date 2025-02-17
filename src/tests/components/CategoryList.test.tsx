import { render, screen, waitForElementToBeRemoved } from "@testing-library/react"
import CategoryList from "../../components/CategoryList"
import ReduxProvider from "../../providers/ReduxProvider"
import { Category } from "../../entities";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { simulteDelay, simulteError } from "../utils";
import AllProviders from "../AllProviders";


describe('CategoryList', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.product.create());
    });
  })

  afterAll(() => {
    const categoryIds = categories.map(category => category.id);
    db.product.deleteMany({ where: { id: { in: categoryIds } } });
  })

  it('should render category list', async () => {
    server.use(http.get('/categories', () => HttpResponse.json(categories)));

    const { waitForLoadingToBeRemoved } = renderComponent();
    await waitForLoadingToBeRemoved();

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  })

  it('should render a loading message when fetching categories', () => {
    simulteDelay('/categories');
    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  })

  it('should render a error message when fetching categories error', async () => {
    simulteError('/categories');

    const { waitForLoadingToBeRemoved } = renderComponent();
    await waitForLoadingToBeRemoved();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  })

  const renderComponent = () => {
    const waitForLoadingToBeRemoved = async () => {
      await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    }

    render(
      <CategoryList />
      , { wrapper: AllProviders });

    return {
      waitForLoadingToBeRemoved,
    }
  }

})
