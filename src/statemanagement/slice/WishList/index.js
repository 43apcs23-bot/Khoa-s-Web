import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit'
import { NotifyError, NotifySuccess, NotifyWarning } from "../../../toastify";
import * as api from '../../api/WishListApi';
import { decodeToken } from "react-jwt";
export const initialState = {
    error: null,
    wishListIDs: localStorage.getItem('authenticate') ? decodeToken(localStorage.getItem('authenticate')).wishlist ? decodeToken(localStorage.getItem('authenticate')).wishlist : [] : [],
    wishListData: [],
    loading: false
}

export const getAllWishList = createAsyncThunk('WishList/getAllWishList', async ({ page, limit, sort, brand, category, price }, { rejectWithValue }) => {
    try {
        const { data: { data, token } } = await api.GetAllWishListAPI({ page, limit, sort, brand, category, price });
        localStorage.setItem('authenticate', token)
        return data;
    } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.response?.data?.message || 'Đã có lỗi xảy ra');
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const addWishList = createAsyncThunk('WishList/addWishList', async ({ shoeId, product }, { rejectWithValue }) => {
    try {
        const { data: { message, data, token } } = await api.AddWishListAPI(shoeId);
        localStorage.setItem('authenticate', token)
        NotifySuccess(message || 'Đã thêm vào danh sách yêu thích');
        return { data, product };
    } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.response?.data?.message || 'Đã có lỗi xảy ra');
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const deleteWishList = createAsyncThunk('WishList/deleteWishList', async (shoeId, { rejectWithValue }) => {
    try {
        const { data: { message, data, token } } = await api.DeleteWishListAPI(shoeId);
        localStorage.setItem('authenticate', token)
        NotifySuccess(message || 'Đã xóa khỏi danh sách yêu thích');
        return { data, shoeId };
    } catch (error) {
        if (error.response.status >= 400 && error.response.status <= 500) {
            NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.response?.data?.message || 'Đã có lỗi xảy ra');
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

const wishListSlice = createSlice({
    name: "WishList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllWishList.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllWishList.fulfilled, (state, action) => {
                state.loading = false
                state.wishListData = action.payload
            })
            .addCase(getAllWishList.rejected, (state, action) => {
                state.loading = false
                state.error = true
            })
            .addCase(addWishList.pending, (state) => {
                state.loading = true
            })
            .addCase(addWishList.fulfilled, (state, action) => {
                state.loading = false
                state.wishListIDs = action.payload.data
                state.wishListData = [...state.wishListData, action.payload.product]
            })
            .addCase(addWishList.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteWishList.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteWishList.fulfilled, (state, action) => {
                state.loading = false
                state.wishListIDs = action.payload.data
                state.wishListData = state.wishListData.filter((item) => item._id !== action.payload.shoeId)
            })
            .addCase(deleteWishList.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
});

export const wishListReducer = wishListSlice.reducer;