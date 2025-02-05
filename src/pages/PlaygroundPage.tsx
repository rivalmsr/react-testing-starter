import ProductImageGallery from "../components/ProductImageGallery";

const PlaygroundPage = () => {
  const imageUrls: string[] = [
    'https://dummyimage.com/300x200/000/fff',
    'https://dummyimage.com/400x300/00ff00/000',
  ]

  return <ProductImageGallery imageUrls={imageUrls} />
};

export default PlaygroundPage;
