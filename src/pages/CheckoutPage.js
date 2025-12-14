import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkoutAct } from '../statemanagement/slice/cartSlice'
import { NotifyInfo, NotifyError } from '../toastify'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartData, cartIds } = useSelector(s => s.cart)

  useEffect(() => {
    if (!localStorage.getItem('authenticate')) {
      NotifyInfo('Vui lòng đăng nhập để tiếp tục thanh toán')
      navigate('/')
    }
  }, [navigate])

  const total = cartData.reduce((acc, item) => {
    const idx = cartIds.findIndex(ci => ci.cartId === item._id)
    const qty = idx >= 0 ? cartIds[idx].quantity : 1
    return acc + item.price * qty
  }, 0)

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '', paymentMethod: 'COD' })
  const [loading, setLoading] = useState(false)

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) return NotifyInfo('Vui lòng điền họ tên, số điện thoại và địa chỉ')
    setLoading(true)
    try {
      const payload = { total, shippingInfo: { name: form.name, phone: form.phone, address: form.address, note: form.note }, paymentMethod: form.paymentMethod }
      const savedOrder = await dispatch(checkoutAct(payload))
      if (savedOrder && savedOrder._id) {
        navigate(`/orders/${savedOrder._id}`)
      } else {
        NotifyError('Không thể hoàn tất thanh toán')
      }
    } catch (err) {
      NotifyError(err?.message || 'Đã có lỗi xảy ra')
    } finally { setLoading(false) }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-3">
            <label className="block text-sm">Họ và tên</label>
            <input name="name" value={form.name} onChange={onChange} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={onChange} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Địa chỉ</label>
            <textarea name="address" value={form.address} onChange={onChange} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Ghi chú (tùy chọn)</label>
            <input name="note" value={form.note} onChange={onChange} className="w-full border p-2 rounded" />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Phương thức thanh toán</label>
            <select name="paymentMethod" value={form.paymentMethod} onChange={onChange} className="w-full border p-2 rounded">
              <option value="COD">COD</option>
              <option value="MOMO">MoMo</option>
              <option value="BANK">Bank Transfer</option>
              <option value="CARD">Card</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-[#FE3E69] text-white py-2 rounded mt-4">{loading ? 'Đang xử lý...' : `Thanh toán ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}`}</button>
        </form>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">Đơn hàng</h3>
          <div className="space-y-2">
            {cartData.map((item) => {
              const idx = cartIds.findIndex(ci => ci.cartId === item._id)
              const qty = idx >= 0 ? cartIds[idx].quantity : 1
              return (
                <div key={item._id} className="flex justify-between">
                  <div className="text-sm">{item.title} × {qty}</div>
                  <div className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * qty)}</div>
                </div>
              )
            })}
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold"> <div>Tổng</div> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
