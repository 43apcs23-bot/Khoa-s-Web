import React, { useEffect, useState } from 'react';
// import components
import Product from './Product';
import { LoadingCard } from '../toastify';
const ProductList = ({ data, runningData, error, loungingData, everydayData, loading, title, category, style, limit }) => {
  const [animate, setAnimate] = useState(false);
  const [mainPage, setMainPage] = useState(0);
  const [loungingPage, setLoungingPage] = useState(0);
  const [everydayPage, setEverydayPage] = useState(0);
  const [runningPage, setRunningPage] = useState(0);
  useEffect(() => {
    // trigger fade-in when any product list or page changes
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 320);
    return () => clearTimeout(t);
  }, [data, loungingData, everydayData, runningData, mainPage, loungingPage, everydayPage, runningPage]);

  // reset pages when their data changes
  useEffect(() => setMainPage(0), [data]);
  useEffect(() => setLoungingPage(0), [loungingData]);
  useEffect(() => setEverydayPage(0), [everydayData]);
  useEffect(() => setRunningPage(0), [runningData]);

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
          Sản phẩm đa dạng: đồ thể thao, quần áo, giày dép và phụ kiện chất lượng. Ở nhà hay khi đi chơi, FootGear H có đồ phù hợp cho bạn.</div>
        {loading ? <LoadingCard /> :
          <>
            {(() => {
              const pageSize = limit || 4;
              const pageCount = data ? Math.ceil(data.length / pageSize) : 0;
              const start = mainPage * pageSize;
              const end = start + pageSize;
              return (
                <>
                  <div className={`${animate ? 'fade-in' : ''} ${data?.length >= 4 ? `grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8` : data?.length === 3 ? `grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8` : data?.length === 2 ? `grid md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8` : data?.length === 1 ? `grid md:grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-8` : ""}`}>
                    {data?.slice()?.reverse()?.slice(start, end)?.map((Products, index) => (
                      <div className='flex items-center justify-center' key={start + index}>
                        <Product Products={Products} />
                      </div>
                    ))}
                  </div>
                  {pageCount > 1 && (
                    <div className='flex items-center justify-center gap-4 mt-6'>
                      <button onClick={() => setMainPage(p => Math.max(0, p - 1))} disabled={mainPage === 0} className={`px-3 py-1 rounded ${mainPage === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white'}`}>Trước</button>
                      <div className='text-gray-600'>Trang {mainPage + 1} / {pageCount}</div>
                      <button onClick={() => setMainPage(p => Math.min(pageCount - 1, p + 1))} disabled={mainPage >= pageCount - 1} className={`px-3 py-1 rounded ${mainPage >= pageCount - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white'}`}>Tiếp</button>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        }
        {/* Removed grouped-by-category sections — search & filters control the main list now */}
      </div>
    </section >
  );
};

export default ProductList;
