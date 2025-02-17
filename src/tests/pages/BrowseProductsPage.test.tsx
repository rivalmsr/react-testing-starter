import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Category, Product } from '../../entities'
import BrowseProducts from '../../pages/BrowseProductsPage'
import AllProviders from '../AllProviders'
import { db, getProductByCategoryId } from '../mocks/db'
import { simulteDelay, simulteError } from '../utils'

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category  = db.category.create({ name: 'Category ' + item}); 
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id}));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(category => category.id);
    db.category.deleteMany({ where: { id: { in: categoryIds}}});

    const productIds = products.map(product => product.id);
    db.product.deleteMany({ where: { id: { in: productIds}}});
  });

  it('should show a loading skeleton when fetching categories', async () => {
    simulteDelay('/categories')
    renderComponent();

    expect(await screen.findByRole('progressbar', { name: /categories/i })).toBeInTheDocument();
  });

  it('should hide the loading skeleton after categories are fetched', async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it('should show the loading skeleton when fetching products', async () => {
    simulteDelay('/products');
    renderComponent();

    expect(await screen.findByRole('progressbar', { name: /products/i })).toBeInTheDocument();
  });
  
  it('should hide the loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it('should hide select category when fetching categories is an error', async () => {
    simulteError('/categories');
    const { getCategoriesSkeleton, getCategoryComboBox } = renderComponent();
   
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(getCategoryComboBox()).not.toBeInTheDocument();
  });

  it('should show a error message when fetching products is an error', async () => {
    simulteError('/products');
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  })

  it('should render a select category', async () => {
    const { getCategoriesSkeleton, getCategoryComboBox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoryComboBox();
    const user = userEvent.setup();

    expect(combobox).toBeInTheDocument();
    await user.click(combobox!);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(screen.getByRole('option', { name: category.name})).toBeInTheDocument();
    });
  });

  it('should render a product list', async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    })
  });

  it('should filter a products by category', async () => {
    const { selectCategory, expectProductsInTheDocument } = renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductByCategoryId(selectedCategory.id);
    expectProductsInTheDocument(products);
  })

  it('should render all product if all category is selected', async () => {
    const { selectCategory, expectProductsInTheDocument } = renderComponent();
    
    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsInTheDocument(products);
  })

  const renderComponent = () => {
    render(<BrowseProducts/>, { wrapper: AllProviders });

    const getProductsSkeleton = () => 
      screen.queryByRole('progressbar', { name: /products/i });

    const getCategoriesSkeleton = () => 
      screen.queryByRole('progressbar', { name: /categories/i });

    const getCategoryComboBox = () => screen.queryByRole('combobox');

    const selectCategory = async (selectedCategory: RegExp | string) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const combobox = getCategoryComboBox();
      const user = userEvent.setup();
      await user.click(combobox!);

      const option = screen.getByRole('option', { name: selectedCategory});
      await user.click(option);
    };

    const expectProductsInTheDocument = (products: Product[]) => {
      const row = screen.getAllByRole('row');
      const dataRow = row.slice(1);
      expect(dataRow.length).toEqual(products.length);
      products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      })
    }

    return {
      getProductsSkeleton,
      getCategoriesSkeleton,
      getCategoryComboBox,
      selectCategory,
      expectProductsInTheDocument,
    }
  }
});