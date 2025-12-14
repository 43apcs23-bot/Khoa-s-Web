import React from 'react';
import BrandDropdown from './BrandDropdown';
import CategoryDropdown from './Category';
import PriceRangeDropdown from './PriceRangeDropdown';
import { RiSearch2Line } from 'react-icons/ri';
import { setBrandValue, setPriceValue, setCategoryValue, getAllFilterData, setPageValue } from '../../statemanagement/slice/filterShoes';
import { useDispatch } from 'react-redux';
import { NotifyInfo, NotifySuccess, NotifyWarning } from '../../toastify';
import Pagination from './pagination';
const Search = ({ brandValue, categoryValue, priceValue, pageValue }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getAllFilterData());
  }, [dispatch]);

  const [Category, setCategory] = React.useState(categoryValue || 'Danh mục (tất cả)');
  const [Price, setPrice] = React.useState(priceValue || 'Khoảng giá (tất cả)');
  const [Brand, setbrand] = React.useState(brandValue || 'Thương hiệu (tất cả)');
  const [Page, setPage] = React.useState(pageValue || "Trang (tất cả)");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Page !== "Trang (tất cả)" && Page !== "Tất cả trang") {
      dispatch(setPageValue(Page));
    } else {
      dispatch(setPageValue(''));
    }
    if (Category !== 'Danh mục (tất cả)' && Category !== 'Tất cả danh mục') {
      dispatch(setCategoryValue(Category));
    } else {
      dispatch(setCategoryValue(''));
    }
    if (Price !== 'Khoảng giá (tất cả)' && Price !== 'Tất cả giá') {
      dispatch(setPriceValue(Price));
    } else {
      dispatch(setPriceValue(''));
    }
    if (Brand !== 'Thương hiệu (tất cả)' && Brand !== 'Tất cả thương hiệu') {
      dispatch(setBrandValue(Brand));
    } else {
      dispatch(setBrandValue(''));
    }
    if (Brand === 'Thương hiệu (tất cả)' && Price === 'Khoảng giá (tất cả)' && Category === 'Danh mục (tất cả)' && Page === "Trang (tất cả)") {
      return NotifyWarning('Vui lòng chọn bộ lọc');
    }
    if (Category === 'Tất cả danh mục' && Price === 'Tất cả giá' && Brand === 'Tất cả thương hiệu' && Page === "Tất cả trang" && brandValue === '' && priceValue === '' && categoryValue === '' && pageValue === '') {
      return NotifyWarning('Không có bộ lọc được chọn');
    }
    if (Brand === brandValue && Price === priceValue && Category === categoryValue) {
      return NotifyInfo(`Bạn đã chọn thương hiệu ${Brand}, khoảng giá ${Price} và danh mục ${Category}`);
    }
    NotifySuccess('Áp dụng bộ lọc thành công');
  };
  return (
    <div className='px-[30px] py-6 max-w-[1170px] mx-auto flex flex-col items-center lg:flex-row justify-between gap-4 lg:gap-x-3 relative -top-3 lg:-top-4 lg:shadow-1 bg-white lg:bg-transparent lg:backdrop-blur rounded-lg'>
      <BrandDropdown brand={Brand} setbrand={setbrand} />
      <CategoryDropdown Category={Category} setCategory={setCategory} />
      <PriceRangeDropdown price={Price} setPrice={setPrice} />
      <Pagination Page={Page} setPage={setPage} />
      <button
        className='bg-[#FE3E69] hover:bg-[#fe2856] transition w-full py-4 lg:max-w-[132px] rounded-lg flex justify-center items-center text-white text-lg' onClick={handleSubmit}>
        <RiSearch2Line />
      </button>
      <div style={{
        position: "absolute",
        content: "",
        width: "40px",
        height: "1px",
        background: "#f53737",
        bottom: "-35px",
        left: "50%",
        transform: "translate(-50%)",
        marginLeft: "-10px",
      }}></div>
      <div style={{
        position: "absolute",
        content: "",
        width: "40px",
        height: "1px",
        background: "#f53737",
        bottom: "-25px",
        left: "50%",
        transform: "translate(-50%)"
      }}></div>
    </div>
  );
};

export default Search;
