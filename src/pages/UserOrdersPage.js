import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyOrders } from '../statemanagement/slice/orderSlice'
import { CancelOrderAPI, CompleteOrderAPI, AdvanceOrderAPI, GetAllOrdersAPI, RequestCancelOrderAPI } from '../statemanagement/api/orderApi'
import { NotifySuccess, NotifyError, NotifyInfo } from '../toastify'
import { decodeToken } from 'react-jwt'
import { useNavigate } from 'react-router-dom'

const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  } catch (e) {
    return `VND ${value}`
  }
}

export default function UserOrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myOrders = [], loading } = useSelector(state => state.order || {})
  const [activeTab, setActiveTab] = useState('uncompleted')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  const token = localStorage.getItem('authenticate')
  const me = token ? decodeToken(token) : null
  const isAdmin = me?.role === true

  const [allOrders, setAllOrders] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)

  async function fetchAllOrders(params = {}) {
    setAdminLoading(true)
    try {
      const { data } = await GetAllOrdersAPI(params)
      setAllOrders(data.data || [])
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    } finally {
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    // If not logged in, redirect to home and prompt login
    if (!token) {
      NotifyInfo('Vui lòng đăng nhập để xem đơn hàng')
      navigate('/')
      return
    }

    if (isAdmin) fetchAllOrders({ q: debouncedTerm })
    else dispatch(getMyOrders({ limit: 6, q: debouncedTerm }))
  }, [dispatch, isAdmin, token, navigate, debouncedTerm])

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm((searchTerm || '').trim()), 400)
    return () => clearTimeout(t)
  }, [searchTerm])

  // infinite scroll: observe sentinel and load next page when visible
  const { cursor, hasMore, loadingMore } = useSelector(state => state.order || {})
  const sentinelRef = React.useRef(null)

  React.useEffect(() => {
    if (isAdmin) return; // admin uses different API
    const node = sentinelRef.current
    if (!node) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          dispatch(getMyOrders({ limit: 6, cursor, append: true, q: debouncedTerm }))
        }
      })
    }, { rootMargin: '200px' })
    obs.observe(node)
    return () => obs.disconnect()
  }, [dispatch, cursor, hasMore, loadingMore, loading, isAdmin])

  const orders = isAdmin ? allOrders : myOrders

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders
    const q = searchTerm.toLowerCase()
    return orders.filter(o => o.items.some(it => ((it.title || (it.productId && it.productId.title) || '')).toLowerCase().includes(q)))
  }, [orders, searchTerm])

  // completed / uncompleted slices and sorting by createdAt (rank by time)
  const completedOrders = useMemo(() => filteredOrders.filter(o => o.shippingStatus === 'Hoàn thành'), [filteredOrders])
  const uncompletedOrders = useMemo(() => filteredOrders.filter(o => o.shippingStatus !== 'Hoàn thành'), [filteredOrders])

  const sortedCompleted = useMemo(() => (
    [...completedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [completedOrders])

  const sortedUncompleted = useMemo(() => (
    [...uncompletedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [uncompletedOrders])

  const effectiveLoading = isAdmin ? adminLoading : loading

  return (
    <div className="container mx-auto px-4 py-6 min-h-[600px]">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard title="Đơn hoàn thành" value={completedOrders.length} color="bg-green-500" />
        <SummaryCard title="Đơn chưa hoàn thành" value={uncompletedOrders.length} color="bg-orange-500" />
      </div>

      {/* Tabs */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="flex flex-col sm:flex-row border-b">
          <Tab label="Chưa hoàn thành" active={activeTab === 'uncompleted'} onClick={() => setActiveTab('uncompleted')} />
          <Tab label="Hoàn thành" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
        </div>

        <div className="p-4">
          <div className='mb-4 flex items-center gap-3'>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Tìm theo tên sản phẩm' className='border rounded px-3 py-2 w-full' />
            {searchTerm && <button onClick={() => setSearchTerm('')} className='text-sm text-gray-500 hover:underline'>Xoá</button>}
          </div>
          {effectiveLoading ? (
            <div className="space-y-3">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : (
            <div>
              {activeTab === 'uncompleted' ? (
                sortedUncompleted.length === 0 ? (
                  <EmptyState text="Bạn không có đơn chưa hoàn thành" />
                ) : (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedUncompleted.map(order => (
                        <OrderCard key={order._id} order={order} onClick={() => navigate(`/orders/${order._id}`)} isAdmin={isAdmin} refreshOrders={isAdmin ? fetchAllOrders : () => dispatch(getMyOrders({ limit: 6, q: debouncedTerm }))} />
                      ))}
                    </div>
                    <div ref={sentinelRef} className='h-8' />
                    {loadingMore && <div className='text-center py-3 text-sm text-gray-500'>Đang tải thêm...</div>}
                    {!hasMore && <div className='text-center py-3 text-sm text-gray-400'>Không còn đơn hàng</div>}
                  </div>
                )
              ) : (
                sortedCompleted.length === 0 ? (
                  <EmptyState text="Bạn chưa có đơn hoàn thành" />
                ) : (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedCompleted.map(order => (
                        <OrderCard key={order._id} order={order} onClick={() => navigate(`/orders/${order._id}`)} isAdmin={isAdmin} refreshOrders={isAdmin ? fetchAllOrders : () => dispatch(getMyOrders({ limit: 6, q: debouncedTerm }))} />
                      ))}
                    </div>
                    <div ref={sentinelRef} className='h-8' />
                    {loadingMore && <div className='text-center py-3 text-sm text-gray-500'>Đang tải thêm...</div>}
                    {!hasMore && <div className='text-center py-3 text-sm text-gray-400'>Không còn đơn hàng</div>}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg p-5 flex items-center justify-between`}> 
      <div>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
      </div>
      <div className="p-2 rounded-full bg-white/20 text-white text-sm font-semibold">{value}</div>
    </div>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full sm:w-auto px-4 py-3 text-sm font-medium ${active ? 'border-b-2 border-rose-600 text-rose-600' : 'text-gray-500'}`}>
      {label}
    </button>
  )
}

function OrderCard({ order, onClick, isAdmin = false, refreshOrders = null }) {
  const isCompleted = order.shippingStatus === 'Hoàn thành'
  const badgeColor = isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'

  const dispatch = useDispatch()
  const tokenLocal = localStorage.getItem('authenticate')
  const meLocal = tokenLocal ? decodeToken(tokenLocal) : null
  const localIsAdmin = isAdmin || meLocal?.role === true
  const isOwner = order.userId?._id === meLocal?._id || order.userId === meLocal?._id
  async function handleCancel(e) {
    e.stopPropagation();
    try {
      const reason = prompt('Nhập lý do hủy đơn (tùy chọn):')
      if (meLocal?.role === true) {
        // admin cancel
        await CancelOrderAPI(order._id, { reason })
      } else {
        // owner cancel (only allowed when 'Chờ xác nhận')
        if (order.shippingStatus !== 'Chờ xác nhận') {
          return NotifyError('Chỉ có thể hủy khi trạng thái là Chờ xác nhận')
        }
        if (!reason || reason.trim().length === 0) return NotifyError('Vui lòng nhập lý do hủy')
        await RequestCancelOrderAPI(order._id, { reason })
      }
      NotifySuccess('Đã hủy đơn')
      if (typeof refreshOrders === 'function') await refreshOrders()
      else dispatch(getMyOrders({ limit: 6 }))
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    }
  }

  async function handleComplete(e) {
    e.stopPropagation();
    try {
      await CompleteOrderAPI(order._id)
      NotifySuccess('Đã hoàn thành đơn')
      if (typeof refreshOrders === 'function') await refreshOrders()
      else dispatch(getMyOrders({ limit: 6 }))
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    }
  }

  async function handleAdvance(e) {
    e.stopPropagation();
    try {
      await AdvanceOrderAPI(order._id)
      NotifySuccess('Đã chuyển trạng thái')
      if (typeof refreshOrders === 'function') await refreshOrders()
      else dispatch(getMyOrders({ limit: 6 }))
    } catch (err) {
      NotifyError(err?.response?.data?.message || err.message || 'Đã có lỗi xảy ra')
    }
  }
  
  return (
    <div onClick={onClick} className="border rounded-lg p-4 cursor-pointer hover:shadow transition">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">Mã đơn</div>
          <div className="font-semibold">{order._id.slice(-8)}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{order.shippingStatus}</div>
      </div>

      <div className="mt-3 text-sm text-gray-500">
        <div>Ngày tạo: {new Date(order.createdAt).toLocaleString()}</div>
        {isCompleted && <div>Hoàn thành: {new Date(order.updatedAt).toLocaleString()}</div>}
        {order.shippingStatus === 'Đã hủy' && order.cancelReason && (
          <div className='mt-2 text-sm text-red-600'>Lý do hủy: {order.cancelReason}</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="font-semibold text-rose-600">{formatCurrency(order.totalAmount)}</div>
        <div className='flex items-center gap-3'>
          {/* Show action buttons depending on role/status */}
          {(() => {
            const isCanceled = order.shippingStatus === 'Đã hủy'
            if (isCanceled) {
              return <button disabled className='text-sm text-red-300 cursor-not-allowed'>Đã hủy</button>
            }

            if (localIsAdmin) {
              const adminCannotCancel = ['Đã hủy','Giao hàng thành công','Hoàn thành'].includes(order.shippingStatus)
              return <button onClick={handleCancel} disabled={adminCannotCancel} className={`text-sm ${adminCannotCancel ? 'text-red-300 cursor-not-allowed' : 'text-red-600 hover:underline'}`}>{adminCannotCancel ? 'Không thể hủy' : 'Hủy'}</button>
            }

            // owner can cancel when order is 'Chờ xác nhận'
            if (isOwner && order.shippingStatus === 'Chờ xác nhận') {
              return <button onClick={handleCancel} className='text-sm text-red-600 hover:underline'>Hủy</button>
            }

            return null
          })()}
                { localIsAdmin && ['Chờ xác nhận','Đang xử lý','Đang vận chuyển'].includes(order.shippingStatus) && (
            <button onClick={handleAdvance} className='text-sm text-blue-600 hover:underline'>Tiếp</button>
          ) }
          { (isOwner && order.shippingStatus === 'Giao hàng thành công') && (
            <button onClick={handleComplete} className='text-sm text-green-600 hover:underline'>Hoàn thành</button>
          ) }
          <button className="text-sm text-rose-600 hover:underline" onClick={(e) => { e.stopPropagation(); onClick(); }}>Xem chi tiết</button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="py-20 text-center text-gray-500">{text}</div>
  )
}

function SkeletonRow() {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="rounded bg-gray-200 h-24 w-full" />
    </div>
  )
}
