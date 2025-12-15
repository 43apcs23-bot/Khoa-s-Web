import React, { useEffect, useState } from 'react'
import { GetAllOrdersAPI, AdvanceOrderAPI, CancelOrderAPI } from '../statemanagement/api/orderApi'
import { NotifySuccess, NotifyError } from '../toastify'
import { decodeToken } from 'react-jwt'
import { useNavigate } from 'react-router-dom'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // redirect non-admins
  const token = localStorage.getItem('authenticate')
  const me = token ? decodeToken(token) : null
  useEffect(() => {
    if (!me || me.role !== true) navigate('/')
  }, [me, navigate])

  async function fetchOrders() {
    setLoading(true)
    try {
      const { data } = await GetAllOrdersAPI()
      setOrders(data.data || [])
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  async function handleAdvance(id) {
    try {
      await AdvanceOrderAPI(id)
      NotifySuccess('Đã chuyển trạng thái')
      fetchOrders()
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    }
  }

  async function handleCancel(id) {
    try {
      const reason = prompt('Nhập lý do hủy đơn (tùy chọn):')
      await CancelOrderAPI(id, { reason })
      NotifySuccess('Đã hủy đơn')
      fetchOrders()
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    }
  }

  if (loading) return <div className='container mx-auto p-4'>Đang tải...</div>

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <div className='text-gray-500'>Chưa có đơn hàng</div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {orders.map(o => (
            <div key={o._id} className='border rounded p-4 flex items-center justify-between'>
              <div>
                <div className='font-medium'>Mã: {o._id.slice(-8)}</div>
                <div className='text-sm text-gray-500'>Người đặt: {o.userId?.name || '—'} ({o.userId?.email || '—'})</div>
                <div className='text-sm text-gray-500'>Trạng thái: {o.shippingStatus}</div>
                <div className='text-sm text-gray-500'>Tổng: {o.totalAmount}</div>
              </div>
              <div className='flex items-center gap-3'>
                <button disabled={o.shippingStatus === 'Giao hàng thành công' || o.shippingStatus === 'Đã hủy'} onClick={() => handleCancel(o._id)} className={`text-sm ${o.shippingStatus === 'Giao hàng thành công' || o.shippingStatus === 'Đã hủy' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:underline'}`}>{o.shippingStatus === 'Đã hủy' ? 'Đã hủy' : 'Hủy'}</button>
                <button disabled={['Giao hàng thành công','Đã hủy'].includes(o.shippingStatus)} onClick={() => handleAdvance(o._id)} className={`text-sm ${['Giao hàng thành công','Đã hủy'].includes(o.shippingStatus) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}>Tiếp</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
