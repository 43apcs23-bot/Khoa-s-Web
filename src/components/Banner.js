import React from 'react';
import Image from '../assets/homepage.svg';
import { setCategoryValue } from '../statemanagement/slice/filterShoes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Banner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ShoeForMen = () => {
    dispatch(setCategoryValue('Nam'));
    navigate('/products');
  };
  const ShoeForWomen = () => {
    dispatch(setCategoryValue('Nữ'));
    navigate('/products');
  };
  const ShoeForKids = () => {
    dispatch(setCategoryValue('Trẻ em'));
    navigate('/products');
  };
  return (
    <section className='min-h-[80vh] flex flex-col justify-center'>
      <div className='text-center p-4 sm:p-10 flex flex-col gap-10 md:flex-row md:flex-wrap items-center justify-center'>
        <div className='basis-1/3 flex-1'>
          <h1 className='text-2xl sm:text-4xl font-semibold text-gray-800 mb-4 capitalize'>
            <p className='text-[#FE3E69] text-4xl lg:text-[66px] font-medium leading-none'>
              Shoe Store</p> cửa hàng giày mơ ước
          </h1>
          <p className='mb-8 px-[0.5rem] lg:mx-10 text-justify font-normal text-xl'>
            Shoe Store là cửa hàng giày mơ ước cho những người yêu giày. Chúng tôi có nhiều loại giày phù hợp cho mọi dịp: sneakers êm ái, dép thoải mái, đi chơi đêm hay dạo phố ban ngày. Bền, thoải mái và thân thiện với môi trường — ở nhà hay khi đi xa, chúng tôi có đôi giày phù hợp cho bạn.
          </p>
          <div className="flex gap-1 items-center justify-around py-2 text-[#FE3E69]">
            <button
              className='bg-[#FE3E69] hover:bg-[#fe2856] transition px-4 py-3 lg:max-w-[162px] rounded-lg text-white text-lg' onClick={ShoeForMen}>
              Giày Nam
            </button>
            <button
              className='bg-[#FE3E69] hover:bg-[#fe2856] transition px-4 py-3 lg:max-w-[162px] rounded-lg text-white text-lg' onClick={ShoeForWomen}>
              Giày Nữ
            </button>
            <button
              className='bg-[#FE3E69] hover:bg-[#fe2856] transition px-4 py-3 lg:max-w-[162px] rounded-lg text-white text-lg hidden sm:inline-block' onClick={ShoeForKids}>
              Giày Trẻ em
            </button>
          </div>
        </div>
        <div className='basis-1/3 flex-1'>
          <div style={{
            backgroundImage: "linear-gradient(360deg, #db506e 0%, #fe3e69 75%)",
          }}
            className="m-auto bg-white rounded-full w-[21rem] h-[21rem] relative overflow-hidden md:h-[26rem] md:w-[26rem] lg:h-[30rem] lg:w-[30rem]"
          >
            <img className="cursor-pointer scale-90 hover:scale-95 transition-transform duration-300 ease-in-out" width={620} src={Image} alt='' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
