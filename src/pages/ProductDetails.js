import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShoeById, getShoeByIdOnPageLoad } from '../statemanagement/slice/ShoeSlice/index';
import { decodeToken } from 'react-jwt';
import { addCarts, CartisOpen } from '../statemanagement/slice/cartSlice';
import { UpdateShoeAPI } from '../statemanagement/api/ShoeApi';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ShoeForOption from '../components/Model/productFunctions/shoeForOption';
import Category from '../components/Model/productFunctions/category';
import { LoadingSinglePage } from '../toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem('authenticate');
  const decodeData = decodeToken(token);
  const dispatch = useDispatch();
  const { singleShoeData, loading } = useSelector((state) => state.shoeDetails);
  const { cartIds } = useSelector((state) => state.cart);
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editData, setEditData] = useState({ title: '', description: '', price: 0, category: [], quantity: 0, shoeFor: [], brand: '', selectedFile: [] })

  const addToCart = async ({ product, shoeId, quantity = 1 }) => {
    await dispatch(addCarts({ product, shoeId, quantity }));
    await dispatch(CartisOpen(true));
  };

  useEffect(() => {
    dispatch(getShoeById(id));
    dispatch(getShoeByIdOnPageLoad(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!cartIds || !singleShoeData) return;
    const entry = cartIds.find(ci => ci.cartId === id);
    setQty(entry ? entry.quantity : 0);
  }, [cartIds, id, singleShoeData]);

  if (loading || !singleShoeData) return <LoadingSinglePage />;

  return (
    <div className='container mx-auto min-h-[600px] mt-4'>
      {/* Header */}
      <div className='text-2xl font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-4 sm:gap-y-0 mb-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-x-2 gap-y-2 sm:gap-y-0'>
          <div className='text-2xl font-semibold'>{singleShoeData?.title}</div>
          <div className='flex flex-wrap gap-2'>
            {singleShoeData?.shoeFor?.map((shoeF, index) => (
              <span
                key={index}
                className='capitalize bg-green-500 rounded-full text-white px-3 py-2 inline-block transform transition-all duration-200 hover:scale-105 hover:bg-green-600'
              >
                {shoeF}
              </span>
            )).splice(0, 1)}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-x-4 gap-y-2 sm:gap-y-0'>
          <div className='bg-rose-500 rounded-full text-white px-3 py-2 inline-block'>
            Còn lại: {singleShoeData?.quantity}
          </div>
          <div className='text-2xl font-semibold text-rose-600'>
            VND {singleShoeData?.price}
          </div>
          {decodeData?.role === true && (
            <button onClick={() => { setIsEditOpen(true); setEditData({
              title: singleShoeData.title,
              description: singleShoeData.description,
              price: singleShoeData.price,
              category: singleShoeData.category,
              quantity: singleShoeData.quantity,
              shoeFor: singleShoeData.shoeFor,
              brand: singleShoeData.brand,
              selectedFile: singleShoeData.selectedFile,
            }) }} className='ml-4 px-3 py-2 border rounded text-sm bg-white'>Edit (Admin)</button>
          )}
        </div>
      </div>

      {/* Mobile category */}
      <div className='text-sm font-normal flex sm:hidden items-center gap-2 mb-4'>
        <div className='flex flex-wrap gap-2'>
          {singleShoeData?.category?.map((category, index) => (
            <span
              key={index}
              className='capitalize bg-green-500 rounded-full text-white px-3 py-2 inline-block transform transition-all duration-200 hover:scale-105 hover:bg-green-600'
            >
              {category}
            </span>
          )).splice(0, 1)}
        </div>
        <div className='bg-rose-500 rounded-full text-white px-3 py-2 inline-block'>
          Available: {singleShoeData?.quantity}
        </div>
      </div>

      {/* Main content */}
      <div className='flex flex-col gap-10 items-start md:flex-row text-left'>
        {/* Image + description */}
        <div className='basis-1/3 flex-1 flex flex-col'>
          <img
            className='m-auto rounded-lg w-full max-w-[680px] h-auto object-contain bg-white transform transition duration-300 hover:scale-105'
            src={singleShoeData?.selectedFile[0]}
            alt=''
          />

          {/* Box mô tả sản phẩm */}
          <div className='mt-4 px-2 flex flex-col'>
            {/* Label luôn hiện */}
            <div className='font-semibold text-lg mb-2'>Mô tả sản phẩm</div>

            {/* Nội dung mô tả scroll chỉ khi dài */}
            <div className='text-sm text-gray-700 overflow-auto leading-relaxed border border-gray-200 rounded-md p-3 max-h-96'>
              {singleShoeData?.description}
            </div>
          </div>
        </div>

        {/* Add-to-cart card */}
        <div className='basis-1/3 flex-1 w-full mb-8 bg-white border border-gray-300 rounded-lg px-6 py-8'>
          <div className='flex items-center gap-x-4 mb-8'>
            <div className='w-10 h-10 p-1 border border-gray-300 rounded-full'>
              <img src={singleShoeData?.selectedFile[0]} alt='' />
            </div>
            <div>
              <div className='font-bold text-lg'>{singleShoeData?.title}</div>
              <Link to='' className='text-rose-700 text-sm'>
                Đặt hàng ngay
              </Link>
            </div>
          </div>

          <div className='flex flex-col gap-y-4'>
            <div className='space-y-4'>
              {/* Quantity and Add-to-cart */}
              <div className='mt-2'>
                <label className='block text-sm font-medium mb-2'>Số lượng</label>
                <div className='flex flex-col md:flex-row md:items-center gap-3'>
                  <div className='flex items-center gap-x-4'>
                    <button
                      aria-label='Giảm số lượng'
                      className={`w-12 h-12 flex items-center justify-center rounded-full border text-xl font-bold transform transition duration-200 ease-out ${qty <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:scale-110 active:scale-95'}`}
                      onClick={() => setQty(prev => Math.max(0, prev - 1))}
                      disabled={qty <= 0}
                    >
                      −
                    </button>

                    <div className='min-w-[50px] text-center font-semibold text-lg'>{qty}</div>

                    <button
                      aria-label='Tăng số lượng'
                      className={`w-12 h-12 flex items-center justify-center rounded-full border text-xl font-bold transform transition duration-200 ease-out ${qty >= (singleShoeData?.quantity || 0) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:scale-110 active:scale-95'}`}
                      onClick={() => setQty(prev => Math.min(singleShoeData?.quantity || 0, prev + 1))}
                      disabled={qty >= (singleShoeData?.quantity || 0)}
                    >
                      +
                    </button>
                  </div>

                  <div className='md:ml-6 mt-4 md:mt-0 w-full md:w-auto'>
                    <button
                      className={`w-full md:w-auto py-3 px-6 rounded-md text-white font-medium transform transition duration-200 ease-out ${(singleShoeData?.quantity === 0 || qty <= 0 || decodeData?.role === true) ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-700 hover:scale-105 hover:bg-rose-800 active:scale-95'}`}
                      onClick={async () => {
                        if (singleShoeData?.quantity === 0 || qty <= 0 || decodeData?.role === true) return;
                        await addToCart({ product: singleShoeData, shoeId: id, quantity: qty });
                        setAdded(true);
                        setTimeout(() => setAdded(false), 1500);
                      }}
                      disabled={singleShoeData?.quantity === 0 || qty <= 0 || decodeData?.role === true}
                    >
                      {added ? 'Đã thêm ✓' : (cartIds.find(ci => ci.cartId === id) ? 'Cập nhật giỏ hàng' : (decodeData?.role === true ? 'Quản trị viên không thể thêm' : 'Thêm vào giỏ hàng'))}
                    </button>
                    {decodeData?.role === true && (
                      <div className='text-xs text-gray-500 mt-2'>Tài khoản quản trị viên không có giỏ hàng.</div>
                    )}
                  </div>
                </div>

                <p className='text-xs text-gray-500 mt-2 md:hidden'>Tối đa: {singleShoeData?.quantity} sản phẩm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cancel/Submit edit modal */}
      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => setIsEditOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as='h3' className='text-lg font-medium mb-3'>Chỉnh sửa sản phẩm</Dialog.Title>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className='border p-2' placeholder='Tiêu đề' />
                    <input value={editData.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} className='border p-2' placeholder='Giá' />
                    <input value={editData.brand} onChange={(e) => setEditData({ ...editData, brand: e.target.value })} className='border p-2' placeholder='Thương hiệu' />
                    <div className='col-span-2'>
                      <label className='block text-sm mb-1'>Danh mục</label>
                      <Category category={Array.isArray(editData.category) ? editData.category : (editData.category ? editData.category : ["Nam", "Nữ", "Trẻ em"])} setCategory={setEditData} AddProductData={editData} />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-sm mb-1'>Dành cho</label>
                      <ShoeForOption shoeFor={Array.isArray(editData.shoeFor) ? editData.shoeFor[0] : editData.shoeFor} setShoeFor={(v) => setEditData({ ...editData, shoeFor: Array.isArray(v.shoeFor) ? v.shoeFor : [v.shoeFor] })} AddProductData={editData} />
                    </div>
                    <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className='border p-2 col-span-2' placeholder='Mô tả' />
                  </div>
                  <div className='mt-4 flex justify-end gap-3'>
                    <button onClick={() => setIsEditOpen(false)} className='px-4 py-2 border rounded'>Huỷ</button>
                    <button onClick={async () => {
                      try {
                        const payload = { ...editData, shoeFor: Array.isArray(editData.shoeFor) ? editData.shoeFor : (editData.shoeFor ? [editData.shoeFor] : []) }
                        await UpdateShoeAPI(id, payload)
                        dispatch(getShoeById(id))
                        dispatch(getShoeByIdOnPageLoad(id))
                        setIsEditOpen(false)
                      } catch (err) {
                        console.error(err)
                      }
                    }} className='px-4 py-2 rounded bg-rose-600 text-white'>Lưu</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductDetails;
