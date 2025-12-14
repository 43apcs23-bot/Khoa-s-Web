import React from 'react';
// import components
import Product from './Product';
import { LoadingCard } from '../toastify';
const ProductList = ({ data, runningData, error, loungingData, everydayData, loading, title, category, style, limit }) => {
  if (error === true) {
    return (
      <div className='text-center text-3xl text-gray-400 my-48'>
        {title === 'Yêu thích' || title === 'WishList' ? 'Không có mục nào trong danh sách yêu thích!' : 'Không tìm thấy sản phẩm!'}
      </div>
    );
  }
  return (
    <section className='mb-20 mt-10'>
      <div className='container mx-auto'>
        <div
          className='text-center text-[1.75rem] font-bold text-black mb-2' style={style}
        >{title} {category ? `cho ${category}` : ""}</div>
        <div className='text-center text-gray-700 mb-7 mt-3 mx-auto text-md font-[400] max-w-2xl italic' style={style}>
          Giày thể thao siêu bông. Dép mềm êm. Quần bông thật xù. Ở nhà hay ra ngoài, chúng tôi có mọi thứ anh ấy cần để thư giãn.</div>
        {loading ? <LoadingCard /> :
          <div className={data?.length >= 4 ? `grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8` : data?.length === 3 ? `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8` : data?.length === 2 ? `grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8` : data?.length === 1 ? `grid md:grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-8` : ""}>
            {data?.slice()?.reverse()?.map((Products, index) => {
              return (
                <div className='flex items-center justify-center' key={index}>
                  <Product Products={Products} />
                </div>
              );
            }).slice(0, limit)}
          </div>
        }
        {loungingData &&
          loungingData?.length !== 0 &&
          <>
            <div className='w-full h-[1px] bg-[#957272] mt-12 mb-10'></div>
            <div
              className='text-center text-[1.75rem] font-bold text-black mb-2' style={style}
            >Giày thư giãn {category ? `cho ${category}` : ""} </div>
            <div className='text-center text-gray-700 mb-7 mt-3 mx-auto text-md font-[400] max-w-2xl italic' style={style}>
              Giày thể thao siêu bông. Dép mềm êm. Quần bông thật xù. Ở nhà hay ra ngoài, chúng tôi có mọi thứ anh ấy cần để thư giãn.</div>
            <div className={loungingData?.length >= 4 ? `grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8` : loungingData?.length === 3 ? `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8` : loungingData?.length === 2 ? `grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8` : loungingData?.length === 1 ? `grid md:grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-8` : ''}>
              {loungingData?.slice()?.reverse()?.map((Products, index) => {
                return (
                  <Product Products={Products} key={index} />
                );
              }).slice(0, 4)}
            </div>
          </>
        }
        {everydayData &&
          everydayData?.length !== 0 &&
          <>
            <div className='w-full h-[1px] bg-[#957272] mt-12 mb-10'></div>
            <div
              className='text-center text-[1.75rem] font-bold text-black my-2' style={style}
            >Giày hàng ngày {category ? `cho ${category}` : ""}</div>
            <div className='text-center text-gray-700 mb-7 mt-3 mx-auto text-md font-[400] max-w-2xl italic' style={style}>
              Giày thể thao siêu bông. Dép mềm êm. Quần bông thật xù. Ở nhà hay ra ngoài, chúng tôi có mọi thứ anh ấy cần để thư giãn.</div>
            <div className={everydayData?.length >= 4 ? `grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8` : everydayData?.length === 3 ? `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8` : everydayData?.length === 2 ? `grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8` : everydayData?.length === 1 ? `grid md:grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-8` : ""}>
              {everydayData?.slice()?.reverse()?.map((Products, index) => {
                return (
                  <Product Products={Products} key={index} />
                );
              }).slice(0, 4)}
            </div>
          </>
        }
        {runningData &&
          runningData?.length !== 0 &&
          <>
            <div className='w-full h-[1px] bg-[#957272] mt-12 mb-10'></div>
            <div
              className='text-center text-[1.75rem] font-bold text-black mb-2' style={style}
            >Giày chạy bộ {category ? `cho ${category}` : ""}</div>
            <div className='text-center text-gray-700 mb-7 mt-3 mx-auto text-md font-[400] max-w-2xl italic' style={style}>
              Giày thể thao siêu bông. Dép mềm êm. Quần bông thật xù. Ở nhà hay ra ngoài, chúng tôi có mọi thứ anh ấy cần để thư giãn.</div>
            <div className={runningData?.length >= 4 ? `grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8` : runningData?.length === 3 ? `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8` : runningData?.length === 2 ? `grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8` : runningData?.length === 1 ? `grid md:grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-8` : ""}>
              {runningData?.slice()?.reverse()?.map((Products, index) => {
                return (
                  <Product Products={Products} key={index} />
                );
              }).slice(0, 4)}
            </div>
          </>
        }
      </div>
    </section >
  );
};

export default ProductList;
