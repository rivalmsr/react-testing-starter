import { useQuery } from "react-query";
import axios from "axios";
import { Category } from "../entities";

function CategoryList() {
  const { data: categories, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => axios.get<Category[]>("/categories").then(resp => resp.data),
  })

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Category List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {categories?.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
