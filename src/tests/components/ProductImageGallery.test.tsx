import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../components/ProductImageGallery'

describe('ProductImageGallery', () => {
  it('should not render list of images when image urls is empty', () => {
    const {container} = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render list of images', () => {
    const imageUrls: string[] = [
      'https://dummyimage.com/300x200/000/fff',
      'https://dummyimage.com/400x300/00ff00/000',
    ];
    render(<ProductImageGallery imageUrls={imageUrls} />)

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url);
    })
  })
});