import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyOrders } from '../statemanagement/slice/orderSlice'
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

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  const completedOrders = useMemo(() => myOrders.filter(o => o.shippingStatus === 'DELIVERED'), [myOrders])
  const uncompletedOrders = useMemo(() => myOrders.filter(o => o.shippingStatus !== 'DELIVERED'), [myOrders])

  // sorting
  const sortedCompleted = useMemo(() => (
    [...completedOrders].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  ), [completedOrders])

  const sortedUncompleted = useMemo(() => (
    [...uncompletedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [uncompletedOrders])

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
          {loading ? (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedUncompleted.map(order => (
                      <OrderCard key={order._id} order={order} onClick={() => navigate(`/orders/${order._id}`)} />
                    ))}
                  </div>
                )
              ) : (
                sortedCompleted.length === 0 ? (
                  <EmptyState text="Bạn chưa có đơn hoàn thành" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedCompleted.map(order => (
                      <OrderCard key={order._id} order={order} onClick={() => navigate(`/orders/${order._id}`)} />
                    ))}
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

function OrderCard({ order, onClick }) {
  const isCompleted = order.shippingStatus === 'DELIVERED'
  const badgeColor = isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'

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
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="font-semibold text-rose-600">{formatCurrency(order.totalAmount)}</div>
        <button className="text-sm text-rose-600 hover:underline" onClick={(e) => { e.stopPropagation(); onClick(); }}>Xem chi tiết</button>
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
