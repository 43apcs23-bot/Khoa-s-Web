import * as api from '../../api/ShoeApi';
import { createAsyncThunk } from '@reduxjs/toolkit'
import { NotifyError, NotifySuccess, NotifyWarning } from '../../../toastify';
export const initialState = {
    error: null,
    shoeData: [],
    loungingData: [],
    everydayData: [],
    runningData: [],
    singleShoeData: '',
    topShoeData: [],
    loading: false
}
export const getAllShoe = createAsyncThunk('Shoe/getAllShoe', async ({ page, limit, sort, brand, category, price, searchName, age }, { rejectWithValue }) => {
    try {
        const { data: { data, runnning, lounging, everyday } } = await api.GetAllShoeAPI({ page, limit, sort, brand, category, price, searchName, age });
        return { data, runnning, lounging, everyday };
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const getTopShoe = createAsyncThunk('Shoe/getTopShoe', async (rejectWithValue) => {
    try {
        const { data: { data } } = await api.GetTopShoeAPI();
        return data;
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const getShoeById = createAsyncThunk('Shoe/getShoeById', async (shoeId) => {
    return shoeId;
});
export const getShoeByIdOnPageLoad = createAsyncThunk('Shoe/getShoeByIdOnPageLoad', async (shoeId, { rejectWithValue }) => {
    try {
        const { data: { data, message } } = await api.GetShoeByIdAPI(shoeId);
        NotifySuccess(message);
        return data;
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);

export const createShoe = createAsyncThunk('Shoe/createShoe', async ({ closeModal, AddProductData }, { rejectWithValue, dispatch, getState }) => {
    try {
        const { data: { message } } = await api.CreateShoeAPI(AddProductData);
        closeModal();
        NotifySuccess(message);
        // Refresh product list using current filter settings so UI updates immediately
        try {
            const state = getState();
            const { filterShoes: { page = 1, limit = 100, sort = 'createdAt', brand = '', category = '', price = '', searchName = '', age = '' } } = state;
            dispatch(getAllShoe({ page, limit, sort, brand, category, price, searchName, age }));
        } catch (err) {
            console.error('Failed to refresh product list after createShoe', err);
            // fallback: dispatch a wide fetch
            dispatch(getAllShoe({ page: 1, limit: 100, sort: 'createdAt', brand: '', category: '', price: '', searchName: '', age: '' }));
        }
        return;
    } catch (error) {
        if (error?.response?.status >= 400 && error?.response?.status <= 500) {
            NotifyWarning(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang")
            return rejectWithValue(error?.response?.data?.message || "Có lỗi, vui lòng tải lại trang");
        } else {
            NotifyError(error?.message || 'Đã có lỗi xảy ra')
            return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
        }
    }
}
);
