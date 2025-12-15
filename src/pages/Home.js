import React from 'react';

// import components
import ProductList from '../components/ProductList';
import Banner from '../components/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShoe } from '../statemanagement/slice/ShoeSlice';
import Search from '../components/filterProduct/Search';
const Home = () => {
  const dispatch = useDispatch();
  const { shoeData, loading, error } = useSelector((state) => state.shoeDetails);
  const { page, sort, brand, category, price, searchName } = useSelector((state) => state.filterShoes);
  React.useEffect(() => {
    // fetch a larger set for home preview so client-side pagination can work
    dispatch(getAllShoe({ page: 1, limit: 100, sort, brand, category, price, searchName }));
  }, [dispatch, sort, brand, category, price, searchName]);
  return (
    <div className='min-h-[1400px]'>
      <Banner />
      <Search brandValue={brand} categoryValue={category} priceValue={price} pageValue={page} loading={loading} />
      <ProductList data={shoeData} error={error} loading={loading} title='Sản phẩm' limit={4} />
    </div>
  );
};

export default Home;
