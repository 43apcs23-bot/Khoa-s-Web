import API from './index'

export const GetMyOrdersAPI = (params) => API.get('/orders/my-orders', { params })
export const GetOrderByIdAPI = (id) => API.get(`/orders/${id}`)
export const CancelOrderAPI = (id, body) => API.post(`/orders/${id}/cancel`, body)
export const CompleteOrderAPI = (id) => API.post(`/orders/${id}/complete`)
export const AdvanceOrderAPI = (id) => API.post(`/orders/${id}/advance`)
export const RequestCancelOrderAPI = (id, body) => API.post(`/orders/${id}/cancel-request`, body)
export const GetAllOrdersAPI = (params) => API.get('/orders', { params })
