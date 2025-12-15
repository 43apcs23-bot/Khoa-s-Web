import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect } from 'react'
import { HiShoppingCart } from "react-icons/hi";
import { IoIosAddCircle } from 'react-icons/io';
import { AiFillMinusCircle } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux'
import {
    cartQuantity,
    getCarts,
    deleteCarts,
    CartisOpen,
    toggleSelect,
    selectAll,
    clearSelection
} from '../statemanagement/slice/cartSlice'
import { LoadingBtn, NotifyInfo } from '../toastify';

export default function Cart() {
    const dispatch = useDispatch()
    const { isOpenCart, cartData, cartIds, status } = useSelector((state) => state.cart)
    const { selectedCartIds } = useSelector((state) => state.cart)

    useEffect(() => {
        dispatch(getCarts())
    }, [dispatch])

    const quantityUserHasAdded = cartIds.map((item) => item.quantity)
    const cartIdsOnly = cartIds.map((item) => item.cartId)

    const data = cartData.map((item) => {
        const index = cartIdsOnly.indexOf(item._id)
        return {
            ...item,
            quantityUserAdd: quantityUserHasAdded[index]
        }
    })

    function closeModal() {
        dispatch(CartisOpen(false))
    }

    function openModal() {
        if (cartIds.length === 0) {
            return NotifyInfo("Giỏ hàng của bạn đang trống")
        }
        dispatch(CartisOpen(true))
    }

    function QuantityStatus({ status, shoeId }) {
        dispatch(cartQuantity({ status, shoeId }))
    }

    function DeleteCart(id) {
        dispatch(deleteCarts(id))
    }



    function CheckoutSelected() {
        if (selectedCartIds.length === 0) return NotifyInfo('Vui lòng chọn ít nhất một sản phẩm để thanh toán')

        const hasInvalidItem = data
            .filter(item => selectedCartIds.includes(item._id))
            .some(item => item.quantityUserAdd > item.quantity)

        if (hasInvalidItem) {
            return NotifyInfo("Một số sản phẩm không đủ số lượng trong kho")
        }

        window.location.href = '/checkout'
    }

    const size = window.innerWidth > 768 ? 'md' : 'sm'
    const selectedData = selectedCartIds && selectedCartIds.length > 0 ? data.filter(item => selectedCartIds.includes(item._id)) : []
    const totalPrice = selectedData.length > 0 ? selectedData.reduce(
        (acc, item) => acc + item.quantityUserAdd * item.price,
        0
    ) : 0

    return (
        <>
            {/* CART ICON */}
            <button
                className={`bg-[#FE3E69] hover:bg-[#ff2f5c] 
                ${size === 'md' && 'fixed right-0 top-3 mr-7'} 
                z-50 rounded-full p-2 text-white cursor-pointer hover:scale-110`}
                onClick={openModal}
            >
                <p className='absolute text-white bg-[#FE3E69] rounded-full px-1 text-sm -mt-2 ml-6'>
                    {cartIds?.length || 0}
                </p>
                <HiShoppingCart className='text-2xl' title='Giỏ hàng' />
            </button>

            {/* MODAL */}
            <Transition appear show={isOpenCart} as={Fragment}>
                <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
                    <div className="fixed inset-0 bg-gray-50 bg-opacity-50" />

                    <div className="fixed right-1 top-0 bottom-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center">
                            <Dialog.Panel className="w-full max-w-md h-[96vh] bg-white rounded-2xl shadow-xl flex flex-col relative">

                                <h3 className="text-lg font-medium text-center py-3">
                                    Giỏ hàng
                                </h3>

                                {/* CART ITEMS */}
                                <div className="flex-1 overflow-auto px-4">
                                    <div className='mb-4 flex items-center justify-between'>
                                        <label className='flex items-center gap-x-2'>
                                            <input type='checkbox' className='form-checkbox' onChange={(e) => {
                                                if (e.target.checked) {
                                                    dispatch(selectAll())
                                                } else {
                                                    dispatch(clearSelection())
                                                }
                                            }} checked={selectedCartIds.length === cartIds.length && cartIds.length > 0} />
                                            <span className='text-sm'>Chọn tất cả</span>
                                        </label>
                                        <button className='text-sm text-rose-700' onClick={() => CheckoutSelected()}>Thanh toán đã chọn</button>
                                    </div>

                                    {data.slice().reverse().map((Products) => {
                                        const isSelected = selectedCartIds.includes(Products._id)
                                        const isOverStock =
                                            Products.quantityUserAdd > Products.quantity

                                        return (
                                            <div
                                                key={Products._id}
                                                className={`mb-4 p-2 rounded-lg 
                                                ${isOverStock ? 'border border-red-500' : ''}`}
                                            >
                                                <div className='flex'>
                                                    <div className='mr-3 flex items-start pt-2'>
                                                        <input type='checkbox' checked={isSelected} onChange={() => dispatch(toggleSelect(Products._id))} />
                                                    </div>
                                                    <div className='relative'>
                                                        <img
                                                            className='w-[100px] h-[100px] object-cover'
                                                            src={Products.selectedFile[0]}
                                                            alt={Products.title}
                                                        />
                                                        <AiFillMinusCircle
                                                            title='Xóa'
                                                            className='absolute top-1 right-1 text-[#FE3E69] cursor-pointer text-xl'
                                                            onClick={() => DeleteCart(Products._id)}
                                                        />
                                                    </div>

                                                    <div className='flex flex-col justify-between ml-4 flex-1'>
                                                        <p className='font-bold text-sm'>
                                                            {Products.title.slice(0, 18)}
                                                        </p>

                                                        {/* QUANTITY */}
                                                        <div className='flex items-center bg-gray-100 rounded-lg px-2 py-1'>
                                                            <IoIosAddCircle
                                                                className={`text-xl mr-2
                                                                ${Products.quantityUserAdd >= Products.quantity
                                                                        ? 'text-gray-300 cursor-not-allowed'
                                                                        : 'text-rose-600 cursor-pointer hover:scale-110'
                                                                    }`}
                                                                onClick={() => {
                                                                    if (Products.quantityUserAdd >= Products.quantity) return
                                                                    QuantityStatus({
                                                                        shoeId: Products._id,
                                                                        status: 'increase'
                                                                    })
                                                                }}
                                                            />

                                                            <span className='mx-2'>
                                                                {status === 'increment'
                                                                    ? <LoadingBtn color="black" width={4} />
                                                                    : Products.quantityUserAdd}
                                                            </span>

                                                            <AiFillMinusCircle
                                                                className='text-gray-600 cursor-pointer hover:scale-110'
                                                                onClick={() =>
                                                                    QuantityStatus({
                                                                        shoeId: Products._id,
                                                                        status: 'decrease'
                                                                    })
                                                                }
                                                            />
                                                        </div>

                                                        {/* STOCK WARNING */}
                                                        {Products.quantityUserAdd >= Products.quantity && (
                                                            <p className="text-xs text-red-500 mt-1">
                                                                Chỉ còn {Products.quantity} sản phẩm trong kho
                                                            </p>
                                                        )}

                                                        {/* PRICE */}
                                                        <p className='font-medium mt-2'>
                                                            {Products.quantityUserAdd} x {Products.price} VND
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* FOOTER */}
                                <div className="p-4 border-t">
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>Tổng:</span>
                                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                                    </div>

                                    <button
                                        className="w-full mt-3 bg-[#FE3E69] hover:bg-[#ff2f5c] 
                                        text-white py-2 rounded-lg hover:scale-105"
                                        onClick={() => CheckoutSelected()}
                                    >
                                        {selectedCartIds && selectedCartIds.length > 0 ? `Thanh toán (${selectedCartIds.length})` : 'Thanh toán'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
