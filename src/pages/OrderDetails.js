import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GetOrderByIdAPI, CancelOrderAPI, CompleteOrderAPI, AdvanceOrderAPI, RequestCancelOrderAPI } from '../statemanagement/api/orderApi'
import CancelModal from '../components/CancelModal'
import { canAdminCancel } from '../utils/orderHelpers'
import { DEFAULT_SHIPPING_FEE } from '../utils/costs'
import { NotifySuccess, NotifyError } from '../toastify'
import { decodeToken } from 'react-jwt'
import { useDispatch } from 'react-redux'
import { getMyOrders } from '../statemanagement/slice/orderSlice'

const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  } catch (e) { return `VND ${value}` }
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const token = localStorage.getItem('authenticate')
  const me = token ? decodeToken(token) : null
  const fetchOrder = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await GetOrderByIdAPI(id)
      setOrder(data.data)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  async function handleCancelSubmit(reason) {
    if (!reason || reason.trim().length === 0) {
      return NotifyError('Vui lòng nhập lý do hủy')
    }
    setSubmitting(true)
    try {
      let data
      if (me?.role === true) {
        const res = await CancelOrderAPI(id, { reason })
        data = res.data
      } else {
        const res = await RequestCancelOrderAPI(id, { reason })
        data = res.data
      }
      NotifySuccess(data.message || 'Đã hủy đơn')
      await fetchOrder()
      dispatch(getMyOrders({ limit: 6 }))
      setShowCancel(false)
      setCancelReason('')
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComplete() {
    setSubmitting(true)
    try {
      const { data } = await CompleteOrderAPI(id)
      NotifySuccess(data.message || 'Đã hoàn thành đơn')
      await fetchOrder()
      dispatch(getMyOrders({ limit: 6 }))
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAdvance() {
    setSubmitting(true)
    try {
      const { data } = await AdvanceOrderAPI(id)
      NotifySuccess(data.message || 'Đã chuyển trạng thái')
      await fetchOrder()
      dispatch(getMyOrders({ limit: 6 }))
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container mx-auto p-4">Đang tải...</div>
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>
  if (!order) return <div className="container mx-auto p-4">Không tìm thấy đơn hàng</div>

  return (
    <div className="container mx-auto p-4">
      <Link to="/orders" className="text-sm text-rose-600 hover:underline">← Quay lại danh sách đơn</Link>
      <div className="mt-4 bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Mã đơn: {order._id.slice(-8)}</h2>
            <p className="text-sm text-gray-500">Ngày tạo: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="mt-1 text-sm">Trạng thái: <span className="font-medium">{order.shippingStatus}</span></p>
          </div>
          <div className="mt-3 sm:mt-0 text-right">
            <div className="text-sm text-gray-500">Tổng</div>
            {(() => {
              const displayTotal = (order.totalAmount || 0) + DEFAULT_SHIPPING_FEE
              return <div className="text-2xl font-bold text-rose-600">{formatCurrency(displayTotal)}</div>
            })()}
          </div>
        </div>

        <div className='mt-4 flex gap-3'>
          {(me?.role === true) && (
            <>
              {(() => {
                const adminCannotCancel = !canAdminCancel(order)
                return (
                  <button
                    onClick={() => { if (!adminCannotCancel) setShowCancel(true) }}
                    disabled={adminCannotCancel}
                    className={`px-4 py-2 ${adminCannotCancel ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-600 text-white'} rounded`}
                  >
                    {adminCannotCancel ? 'Không thể hủy' : (order.shippingStatus === 'Đã hủy' ? 'Đã hủy' : 'Hủy đơn (Admin)')}
                  </button>
                )
              })()}
              {/* admin advance when possible */}
              {['Chờ xác nhận','Đang xử lý','Đang vận chuyển'].includes(order.shippingStatus) && (
                <button onClick={handleAdvance} disabled={submitting} className='px-4 py-2 bg-blue-600 text-white rounded ml-2'>{submitting ? 'Đang...' : 'Tiếp'}</button>
              )}
            </>
          )}
          {(order.userId?._id === me?._id && order.shippingStatus === 'Chờ xác nhận') && (
            <button onClick={() => setShowCancel(true)} className='px-4 py-2 bg-red-600 text-white rounded'>Hủy đơn</button>
          )}
          {(order.userId?._id === me?._id && order.shippingStatus === 'Giao hàng thành công') && (
            <button onClick={handleComplete} disabled={submitting} className='px-4 py-2 bg-green-600 text-white rounded'>{submitting ? 'Đang...' : 'Hoàn thành'}</button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Sản phẩm</h3>
            <div className="space-y-3">
              {order.items.map((it) => {
                const product = it.productId || {}
                return (
                  <div key={product._id || Math.random()} className="flex items-center gap-3">
                    <img src={product.selectedFile?.[0] || ''} alt={product.title} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{product.title || it.title}</div>
                      <div className="text-sm text-gray-500">{it.quantity} × {formatCurrency(it.price)}</div>
                    </div>
                    <div className="font-semibold">{formatCurrency(it.price * it.quantity)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
            <div className="text-sm text-gray-700">
              <div>Tên: {order.shippingInfo?.name || '—'}</div>
              <div>Số điện thoại: {order.shippingInfo?.phone || '—'}</div>
              <div>Địa chỉ: {order.shippingInfo?.address || '—'}</div>
              <div>Ghi chú: {order.shippingInfo?.note || '—'}</div>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Thanh toán</h3>
            <div className="text-sm">Phương thức: {order.paymentMethod || '—'}</div>
            <div className="text-sm mt-2">Trạng thái thanh toán: {order.paymentStatus || '—'}</div>
            {order.shippingStatus === 'Đã hủy' && order.cancelReason && (
              <div className='mt-3 p-3 bg-red-50 rounded'>
                <div className='font-medium'>Lý do hủy:</div>
                <div className='text-sm text-gray-700'>{order.cancelReason}</div>
                {order.cancelledBy && <div className='text-xs text-gray-500 mt-2'>Hủy bởi: {order.cancelledBy.name}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      <CancelModal open={showCancel} initialReason={cancelReason} onClose={() => { setShowCancel(false); setCancelReason('') }} onSubmit={handleCancelSubmit} submitting={submitting} />
    </div>
  )
}
