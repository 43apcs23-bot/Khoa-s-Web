import React from 'react';
// import icons
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsEyeFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addWishList, deleteWishList } from '../statemanagement/slice/WishList';
import { LoadingCircle, NotifyWarning } from '../toastify';
const Product = ({ Products }) => {
  const dispatch = useDispatch();
  const { wishListIDs, loading } = useSelector((state) => state.wishList);
  const token = localStorage.getItem('authenticate');
  return (
    <div className={`shadow-1 px-3 pt-3 rounded-lg rounded-tl-[90px] w-full max-w-[352px] mx-auto cursor-pointer hover:shadow-2xl transition relative`}>
      <div className="relative flex justify-center">
  <img
    className={`mb-3 rounded-tl-[90px]
    min-w-[240px] max-w-[240px] min-h-[240px] max-h-[240px] object-cover`}
    src={Products?.selectedFile[0]}
    alt={Products?.title}
  />

  {/* Quantity badge */}
  <span
    className={`absolute bottom-3 right-3 text-xs font-semibold px-3 py-1 rounded-full
      ${Products?.quantity > 0
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white'
      }`}
  >
    {Products?.quantity > 0
      ? `Còn ${Products.quantity}`
      : 'Hết hàng'}
  </span>
</div>
<div className='w-full h-full flex justify-center items-center rounded-lg rounded-tl-[90px]
      opacity-0 hover:opacity-100 transition duration-500 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 ease-in-out hover:bg-[#00000003]'>
        <Link to={`/product/${Products?._id}`}>
          <button className='bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition duration-300'>
            <BsEyeFill className='text-xl' />
          </button>
        </Link>
        {!token ? (
          <FaRegHeart className='text-2xl 
          text-rose-600 transition duration-500 
          ' style={{
              position: 'absolute',
              top: "5%",
              right: "10%",
            }} title='Thêm vào Yêu thích' onClick={() => NotifyWarning('Bạn cần đăng nhập hoặc đăng ký để thêm sản phẩm vào danh sách yêu thích')} />
        ) : (
          wishListIDs?.find((item) => item === Products?._id) ? (
            loading ? <LoadingCircle /> :
              <FaHeart className='text-2xl 
              text-rose-600 transition duration-500
              ' style={{
                  position: 'absolute',
                  top: "5%",
                  right: "10%",
                }} title='Đã thêm vào Yêu thích' onClick={() => dispatch(deleteWishList(Products?._id))} />
          ) : (
            loading ? <LoadingCircle /> :
              <FaRegHeart className='text-2xl 
            text-rose-600 transition duration-500
            ' style={{
                  position: 'absolute',
                  top: "5%",
                  right: "10%",
                }} title='Thêm vào Yêu thích' onClick={() => dispatch(addWishList({ shoeId: Products?._id, product: Products }))} />
          )
        )}
      </div >
      <div className='mb-2 flex text-sm justify-between px-2 align-center'>
        {Products?.shoeFor?.map((shoeF, index) => {
          const IndexStyle = index === 0 ? 'bg-yellow-400' : 'bg-rose-600';
          return (
            <span className={`capitalize ${IndexStyle} rounded-lg text-white px-4 py-[0.35rem] tracking-[.04em]`} key={index}>{shoeF}</span>
          );
        }
        ).splice(0, 2)}
      </div>
      <div className='flex justify-between mb-2 bg-gray-200 px-4 py-[0.7rem] rounded-lg text-black font-medium'>
        <div className='max-w-[120px]'>
          {Products?.title.split(" ").slice(0, 6).join(" ")}
        </div>
        <div className='text-black'>
          VND {Products?.price}
        </div>
      </div>
    </div >
  );
};

export default Product;
