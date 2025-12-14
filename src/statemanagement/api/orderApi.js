import API from './index'

export const GetMyOrdersAPI = () => API.get('/orders/my-orders')
export const GetOrderByIdAPI = (id) => API.get(`/orders/${id}`)
