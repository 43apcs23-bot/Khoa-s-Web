import { createSlice } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";
import { NotifyError, NotifySuccess, NotifyWarning } from "../../../toastify";
import * as api from '../../api/cartApi';

const Status = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    FAILED: 'failed',
    Increment: 'increment',
});

export const initialState = {
    cartIds: localStorage.getItem('authenticate') ? decodeToken(localStorage.getItem('authenticate')).cart ? decodeToken(localStorage.getItem('authenticate')).cart : [] : [],
    cartData: [],
    status: Status.IDLE,
    isOpenCart: false,
    selectedCartIds: [],
}

export const getCarts = () => async (dispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
        const { data: { data, token } } = await api.GetAllCartAPI();
        dispatch(getAllCartData(data));
        localStorage.setItem('authenticate', token)
        dispatch(setStatus(Status.IDLE));
    } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}

export const addCarts = ({ product, shoeId, quantity = 1, notification }) => async (dispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
        const { data: { data, token, message } } = await api.AddCartAPI(shoeId, { quantity });
        localStorage.setItem('authenticate', token)
        dispatch(addCartData(product));
        dispatch(addCartIds(data));
        dispatch(isOpenCart(true));
        if (notification !== false) {
            NotifySuccess(message || 'Đã thêm vào giỏ hàng');
        }
        dispatch(setStatus(Status.IDLE));
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            if (notification !== false) {
                NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            }
            return dispatch(setStatus(Status.FAILED));
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        }
    }
}

export const CartisOpen = (open) => async (dispatch) => {
    dispatch(isOpenCart(open));
}

export const deleteCarts = (id) => async (dispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
        const { data: { message, data, token } } = await api.DeleteCartAPI(id);
        localStorage.setItem('authenticate', token)
        dispatch(deleteCartData(id));
        dispatch(addCartIds(data));
        NotifySuccess(message || 'Đã xóa khỏi giỏ hàng');
        dispatch(setStatus(Status.IDLE));
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        }
    }
}

export const cartQuantity = ({ status, shoeId }) => async (dispatch) => {
    dispatch(setStatus(Status.Increment));
    try {
        const { data: { message, token, data } } = await api.CartQuantityAPI(shoeId, status);
        dispatch(addCartIds(data));
        localStorage.setItem('authenticate', token)
        NotifySuccess(message || 'Cập nhật số lượng thành công');
        dispatch(setStatus(Status.IDLE));
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        }
    }
}

export const checkoutAct = (payload) => async (dispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
        const { data: { message, token, data } } = await api.checkoutAPI(payload);
        localStorage.setItem('authenticate', token)
        // refresh cart data from server to reflect partial/full checkout
        dispatch(getCarts());
        NotifySuccess(message || 'Thanh toán thành công');
        dispatch(setStatus(Status.IDLE));
        return data; // return saved order to caller
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return dispatch(setStatus(Status.FAILED));
        }
    }
}

const cartSlice = createSlice({
    name: "Cart",
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        getAllCartData: (state, action) => {
            state.cartData = action.payload;
        },
        addCartData: (state, action) => {
            const idx = state.cartData.findIndex(p => p._id === action.payload._id);
            if (idx >= 0) {
                // replace existing product with the newest one
                state.cartData[idx] = action.payload;
            } else {
                state.cartData.push(action.payload);
            }
        },
        addCartIds: (state, action) => {
            state.cartIds = action.payload
        },
        deleteCartData: (state, action) => {
            state.cartData = state.cartData.filter((item) => item._id !== action.payload);
        },
        checkoutCart: (state) => {
            state.cartData = [];
            state.cartIds = [];
        },
        toggleSelect: (state, action) => {
            const id = action.payload;
            if (state.selectedCartIds.includes(id)) {
                state.selectedCartIds = state.selectedCartIds.filter(i => i !== id);
            } else {
                state.selectedCartIds.push(id);
            }
        },
        selectAll: (state) => {
            state.selectedCartIds = state.cartIds.map(ci => ci.cartId);
        },
        clearSelection: (state) => {
            state.selectedCartIds = [];
        },
        isOpenCart: (state, action) => {
            state.isOpenCart = action.payload;
        },
    },
});

export const { setStatus, addCartData, addCartIds, getAllCartData, deleteCartData, checkoutCart, toggleSelect, selectAll, clearSelection, isOpenCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;