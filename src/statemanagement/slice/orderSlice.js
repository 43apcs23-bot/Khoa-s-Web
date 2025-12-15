import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../api/orderApi'
import { NotifyError, NotifyWarning } from '../../toastify'

export const initialState = {
  myOrders: [],
  loading: false,
  loadingMore: false,
  error: null,
  cursor: null,
  hasMore: true,
}

export const getMyOrders = createAsyncThunk('order/getMyOrders', async (opts = {}, { rejectWithValue }) => {
  // opts: { limit, cursor, append }
  try {
    const { data } = await api.GetMyOrdersAPI({ limit: opts.limit, cursor: opts.cursor })
    return data
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
      .addCase(getMyOrders.pending, (state, action) => {
        const append = action.meta.arg && action.meta.arg.append
        if (append) state.loadingMore = true
        else state.loading = true
        state.error = null
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        const append = action.meta.arg && action.meta.arg.append
        if (append) {
          state.loadingMore = false
          // append while avoiding duplicates
          const ids = new Set(state.myOrders.map(o => o._id))
          for (const o of action.payload.data) {
            if (!ids.has(o._id)) state.myOrders.push(o)
          }
        } else {
          state.loading = false
          state.myOrders = action.payload.data
        }
        state.hasMore = !!action.payload.hasMore
        state.cursor = action.payload.nextCursor
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        const append = action.meta.arg && action.meta.arg.append
        if (append) state.loadingMore = false
        else state.loading = false
        state.error = action.payload
      })
  }
})

export const orderReducer = orderSlice.reducer
