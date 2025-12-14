import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GetOrderByIdAPI } from '../statemanagement/api/orderApi'

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

  useEffect(() => {
    let mounted = true
    async function fetchOrder() {
      setLoading(true)
      try {
        const { data } = await GetOrderByIdAPI(id)
        if (!mounted) return
        setOrder(data.data)
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
    return () => { mounted = false }
  }, [id])

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
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(order.totalAmount)}</div>
          </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
