import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../api/orderApi'
import { NotifyError, NotifyWarning } from '../../toastify'

export const initialState = {
  myOrders: [],
  loading: false,
  error: null,
}

export const getMyOrders = createAsyncThunk('order/getMyOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.GetMyOrdersAPI()
    return data.data
  } catch (error) {
    if (error?.response?.status >= 400 && error?.response?.status <= 500) {
      NotifyWarning(error?.response?.data?.message || 'Đã có lỗi xảy ra')
      return rejectWithValue(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    } else {
      NotifyError(error?.message || 'Đã có lỗi xảy ra')
      return rejectWithValue(error?.message || 'Đã có lỗi xảy ra')
    }
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(getMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload })
      .addCase(getMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const orderReducer = orderSlice.reducer
