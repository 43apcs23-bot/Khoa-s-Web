export const canAdminCancel = (order) => {
  if (!order) return false
  const forbidden = ['Giao hàng thành công', 'Hoàn thành', 'Đã hủy']
  return !forbidden.includes(order.shippingStatus)
}

export const canOwnerCancel = (order, me) => {
  if (!order || !me) return false
  const isOwner = order.userId?._id === me?._id || order.userId === me?._id
  return isOwner && order.shippingStatus === 'Chờ xác nhận'
}
