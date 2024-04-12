import axios from "axios";
import { useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";

export default function ProductList() {
  const [page, setPage] = useState(1); // Start with page 1
  const productsPerPage = 100;
  const [productToShow, setProductToShow] = useState([]);
  const [hasMore, setHasMore] = useState(true); // Initialize hasMore to true

  const retrieveProducts = async (pageNumber) => {
    const skip = pageNumber * productsPerPage;
    const response = await axios.get(
      `https://dummyjson.com/products?limit=${productsPerPage}`
    );
    console.log(response);
    return response.data.products;
  };

  const fetchNextProducts = async () => {
    try {
      const newProducts = await retrieveProducts(page + 1); // Fetch next page
      if (newProducts.length > 0) {
        // Check if there are new products
        setProductToShow((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1); // Increment page number
      } else {
        setHasMore(false); // No more products to load
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialProducts = await retrieveProducts(page);
        setProductToShow(initialProducts);
      } catch (error) {
        console.error("Error fetching initial products:", error);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-3xl my-2">Product List</h2>

      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            rowCount={productToShow.length}
            rowHeight={1200} // Adjust this value according to your item height
            rowRenderer={({ index, key, style }) => (
              <div key={key} style={style}>
                <li
                  className="flex flex-col items-center m-2 border rounded-sm"
                  key={productToShow[index].id}
                >
                  <button>
                    <img
                      className="object-cover h-64 w-96 rounded-sm"
                      src={productToShow[index].thumbnail}
                      alt=""
                    />
                    <p className="text-xl my-3">{productToShow[index].title}</p>
                  </button>
                </li>
              </div>
            )}
          />
        )}
      </AutoSizer>
    </div>
  );
}
