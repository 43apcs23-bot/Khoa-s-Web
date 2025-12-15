import React from 'react';
import ProductList from '../components/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShoe } from '../statemanagement/slice/ShoeSlice';
import Search from '../components/filterProduct/Search';

function ProductPage() {
    const dispatch = useDispatch();
    const { shoeData, loading, error, runningData, loungingData, everydayData } = useSelector((state) => state.shoeDetails);
    const { page, sort, brand, category, price, searchName, age } = useSelector((state) => state.filterShoes);
    React.useEffect(() => {
        // On All Products page, fetch a larger limit so ProductList can paginate client-side
        dispatch(getAllShoe({ page: 1, limit: 100, sort, brand, category, price, searchName, age }));
    }, [dispatch, sort, brand, category, price, searchName, age]);
    const style = {
        textAlign: 'left',
        marginLeft: '10px',
    };
    return (
        <div className='min-h-[600px] mt-10'>
            <Search brandValue={brand} categoryValue={category} priceValue={price} pageValue={page} loading={loading} />
            <ProductList data={shoeData} loading={loading} error={error} category={category} title='Tất cả sản phẩm' runningData={runningData} loungingData={loungingData} everydayData={everydayData} style={style} limit={8} />
        </div>
    );
}

export default ProductPage;
