import axios from "axios";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ProductListWithQuery() {
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  const [productToShow, setProductToShow] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const retrieveProducts = async (pageNumber) => {
    const skip = pageNumber * productsPerPage;
    const response = await axios.get(
      `https://dummyjson.com/products?limit=${productsPerPage}&skip=${skip}`
    );
    return response.data.products;
  };

  const retrieveNextProducts = async () => {
    try {
      const newProducts = await retrieveProducts(page + 1);
      if (newProducts.length > 0) {
        setProductToShow((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchData = async () => {
    try {
      const initialProductsData = await retrieveProducts(page);
      setProductToShow(initialProductsData);
    } catch (error) {
      console.error("Error fetching initial products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once on component mount

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>

      <InfiniteScroll
        dataLength={productToShow.length}
        next={retrieveNextProducts}
        hasMore={hasMore}
        loader={<div>Loading...</div>}
        endMessage={<div>No more products</div>}
      >
        <ul className="flex flex-wrap justify-center items-center">
          {productToShow.map((product) => (
            <li
              className="flex flex-col items-center m-2 border rounded-sm"
              key={product.id}
            >
              <button>
                <img
                  className="object-cover h-64 w-96 rounded-sm"
                  src={product.thumbnail}
                  alt=""
                />
                <p className="text-xl my-3">{product.title}</p>
              </button>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
