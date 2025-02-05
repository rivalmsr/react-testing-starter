import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import CategorySelect from "../components/CategorySelect";
import ProductTable from "../components/ProductTable";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-f-xs">
        <CategorySelect onChange={setSelectedCategoryId} />
      </div>
      <div className="overflow-y-auto h-[600px]">
        <ProductTable selectedCategoryId={selectedCategoryId} />
      </div>
    </div>
  );
}

export default BrowseProducts;
