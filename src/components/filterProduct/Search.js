import React, { useEffect, useState } from 'react';
import BrandDropdown from './BrandDropdown';
import CategoryDropdown from './Category';
import AgeDropdown from './AgeDropdown';
import PriceRangeDropdown from './PriceRangeDropdown';
import { RiSearch2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { setBrandValue, setPriceValue, setCategoryValue, setSearchName, getAllFilterData } from '../../statemanagement/slice/filterShoes';
import { NotifySuccess } from '../../toastify';

const Search = ({ brandValue, categoryValue, priceValue }) => {
  const dispatch = useDispatch();

  // Load filter data on mount
  useEffect(() => {
    dispatch(getAllFilterData());
  }, [dispatch]);

  const { searchName: searchNameValue } = useSelector((state) => state.filterShoes);

  // Local state (rename to avoid shadowing imported action `setSearchName`)
  const [SearchInput, setSearchInput] = useState(searchNameValue || '');
  const [Age, setAge] = useState('Tất cả');
  const [Category, setCategory] = useState(categoryValue || 'Danh mục (tất cả)');
  const [Price, setPrice] = useState(priceValue || 'Khoảng giá (tất cả)');
  const [Brand, setBrand] = useState(brandValue || 'Thương hiệu (tất cả)');

  // Sync with props
  useEffect(() => setCategory(categoryValue || 'Danh mục (tất cả)'), [categoryValue]);
  useEffect(() => setPrice(priceValue || 'Khoảng giá (tất cả)'), [priceValue]);
  useEffect(() => setBrand(brandValue || 'Thương hiệu (tất cả)'), [brandValue]);
  useEffect(() => setSearchInput(searchNameValue || ''), [searchNameValue]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug: log current values and action types
    // eslint-disable-next-line no-console
    console.log('Search submit', { SearchInput, Category, Price, Brand, Age, searchNameValue });
    // eslint-disable-next-line no-console
    console.log('Actions types', { setCategoryValue: typeof setCategoryValue, setPriceValue: typeof setPriceValue, setBrandValue: typeof setBrandValue, setSearchName: typeof setSearchName });

    const isCategoryDefault = Category === 'Danh mục (tất cả)';
    const isPriceDefault = Price === 'Khoảng giá (tất cả)';
    const isBrandDefault = Brand === 'Thương hiệu (tất cả)';
    const isAgeDefault = Age === 'Tất cả';
    const hasSearchName = SearchInput.trim().length > 0;

    if (!hasSearchName && isCategoryDefault && isPriceDefault && isBrandDefault && isAgeDefault) {
      // No filters and no search term -> show all products
      try {
        if (typeof setCategoryValue === 'function') dispatch(setCategoryValue(''));
        if (typeof setPriceValue === 'function') dispatch(setPriceValue(''));
        if (typeof setBrandValue === 'function') dispatch(setBrandValue(''));
        if (typeof setSearchName === 'function') dispatch(setSearchName(''));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error dispatching empty filters', err);
        throw err;
      }
      NotifySuccess('Hiển thị tất cả sản phẩm');
      return;
    }

    // Dispatch filter values
    try {
      if (typeof setCategoryValue === 'function') dispatch(setCategoryValue(isCategoryDefault ? '' : Category));
      if (typeof setPriceValue === 'function') dispatch(setPriceValue(isPriceDefault ? '' : Price));
      if (typeof setBrandValue === 'function') dispatch(setBrandValue(isBrandDefault ? '' : Brand));
      if (typeof setSearchName === 'function') dispatch(setSearchName(hasSearchName ? SearchInput.trim() : ''));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error dispatching filters', err);
      throw err;
    }

    NotifySuccess('Áp dụng bộ lọc thành công');
  };

  return (
    <div className="max-w-[1170px] mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Input tìm kiếm */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={SearchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE3E69] focus:border-transparent"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#FE3E69] hover:bg-[#fe2856] text-white px-4 py-3 rounded-lg flex items-center justify-center"
        >
          <RiSearch2Line className="text-lg" />
        </button>
      </div>

      {/* Dropdowns */}
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AgeDropdown value={Age} setValue={setAge} />               {/* Age / Sex */}
        <CategoryDropdown Category={Category} setCategory={setCategory} /> {/* Category */}
        <PriceRangeDropdown price={Price} setPrice={setPrice} />           {/* Price */}
        <BrandDropdown brand={Brand} setbrand={setBrand} />                {/* Brand */}
      </div>
    </div>
  );
};

export default Search;
