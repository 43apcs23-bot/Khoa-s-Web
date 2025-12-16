import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkoutAct, clearSelection } from '../statemanagement/slice/cartSlice'
import { NotifyInfo, NotifyError } from '../toastify'
import { DEFAULT_SHIPPING_FEE } from '../utils/costs'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartData, cartIds } = useSelector(s => s.cart)
  const { selectedCartIds } = useSelector(s => s.cart)

  useEffect(() => {
    if (!localStorage.getItem('authenticate')) {
      NotifyInfo('Vui lòng đăng nhập để tiếp tục thanh toán')
      navigate('/')
    }
  }, [navigate])

  // compute total and items based on selection (if any)
  const selectedItems = selectedCartIds && selectedCartIds.length > 0 ?
    cartData.filter(item => selectedCartIds.includes(item._id)).map(item => {
      const idx = cartIds.findIndex(ci => ci.cartId === item._id)
      const qty = idx >= 0 ? cartIds[idx].quantity : 1
      return { ...item, qty }
    }) : null

  const total = selectedItems ? selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0) : cartData.reduce((acc, item) => {
    const idx = cartIds.findIndex(ci => ci.cartId === item._id)
    const qty = idx >= 0 ? cartIds[idx].quantity : 1
    return acc + item.price * qty
  }, 0)

  // Shipping fee (UI-only). Add this to totals shown on checkout and in modals.
  const shippingFee = DEFAULT_SHIPPING_FEE;
  const totalWithShipping = total + shippingFee;

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '', paymentMethod: 'OFFLINE' })
  const [loading, setLoading] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const [showDepositQr, setShowDepositQr] = useState(false)

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function onSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) return NotifyInfo('Vui lòng điền họ tên, số điện thoại và địa chỉ')
    setLoading(true)
    try {
      const payload = { total, shippingInfo: { name: form.name, phone: form.phone, address: form.address, note: form.note }, paymentMethod: form.paymentMethod }
      if (selectedItems) {
        payload.items = selectedItems.map(i => ({ cartId: i._id, quantity: i.qty }))
      }
      const savedOrder = await dispatch(checkoutAct(payload))
      if (savedOrder && savedOrder._id) {
        // clear selection after successful checkout
        dispatch(clearSelection())
        // if online payment, show qr modal (demo) and mark paid already on server
        if ((form.paymentMethod || '').toUpperCase() === 'ONLINE') {
          setLastOrder(savedOrder)
          setShowQr(true)
        } else {
          // offline: if deposit required, show deposit QR modal (demo)
          if (savedOrder.depositRequired && savedOrder.depositAmount) {
            setLastOrder(savedOrder)
            setShowDepositQr(true)
          } else {
            // navigate to order detail after adding shipping fee display (UI-only)
            navigate(`/orders/${savedOrder._id}`)
          }
        }
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
              <option value="ONLINE">Thanh toán Online (QR)</option>
              <option value="OFFLINE">Thanh toán Offline (Nhận hàng)</option>
            </select>
            {form.paymentMethod === 'OFFLINE' && total > 1000000 && (
              <div className="mt-2 text-sm text-yellow-700">Đơn trên 1.000.000 VND yêu cầu thanh toán trước tối thiểu 20% khi chọn phương thức Offline (demo).</div>
            )}
          </div>

          <button type="submit" className="w-full bg-[#FE3E69] text-white py-2 rounded mt-4">{loading ? 'Đang xử lý...' : `Thanh toán ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalWithShipping)}`}</button>
        </form>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-2">Đơn hàng</h3>
          <div className="space-y-2">
            {(selectedItems ? selectedItems : cartData).map((item) => {
              const qty = selectedItems ? item.qty : (cartIds.findIndex(ci => ci.cartId === item._id) >= 0 ? cartIds[cartIds.findIndex(ci => ci.cartId === item._id)].quantity : 1)
              return (
                <div key={item._id} className="flex justify-between">
                  <div className="text-sm">{item.title} × {qty}</div>
                  <div className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * qty)}</div>
                </div>
              )
            })}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm"> <div>Tạm tính</div> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div></div>
              <div className="flex justify-between text-sm mt-1"> <div>Phí giao hàng</div> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</div></div>
              <div className="flex justify-between font-semibold mt-2"> <div>Tổng thanh toán</div> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalWithShipping)}</div></div>
            </div>
          </div>
        </div>
      </div>
      {showQr && lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="font-semibold mb-3">Thanh toán Online (Demo)</h3>
            <p className="text-sm text-gray-600 mb-3">Quét mã QR để thanh toán (demo). Đơn hàng đã được đánh dấu là <strong>Đã thanh toán</strong>. Tổng (bao gồm phí giao hàng): <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((lastOrder.totalAmount || 0) + shippingFee)}</strong></p>
            <div className="flex justify-center mb-4">
<img 
  src="/qr.jpg" 
  alt="QR" 
  className="w-64 h-auto" // width = 8rem (~128px), height auto giữ tỉ lệ
/>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => { setShowQr(false); navigate(`/orders/${lastOrder._id}`) }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
      {showDepositQr && lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="font-semibold mb-3">Yêu cầu đặt cọc (20%)</h3>
            <p className="text-sm text-gray-600 mb-3">Đơn hàng của bạn vượt quá 1.000.000 VND. Vui lòng thanh toán đặt cọc tối thiểu 20% trước khi chúng tôi xử lý đơn hàng. (Demo)</p>
            <div className="mb-2 text-center font-semibold">Số tiền cần đặt cọc: {(() => {
              const serverDeposit = lastOrder && lastOrder.depositAmount ? Number(lastOrder.depositAmount) : 0
              // show deposit based on displayed total (total + shipping) for clarity
              const displayTotal = (lastOrder.totalAmount || 0) + shippingFee
              const depositBasedOnDisplay = Math.ceil(displayTotal * 0.2)
              return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositBasedOnDisplay || serverDeposit || '—')
            })()}</div>
            <div className="flex justify-center mb-4">
              <img src="/qr.jpg" alt="QR Deposit" className="w-64 h-auto" />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => { setShowDepositQr(false); navigate(`/orders/${lastOrder._id}`) }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
