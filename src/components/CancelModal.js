import React from 'react'

export default function CancelModal({ open, initialReason = '', onClose, onSubmit, submitting = false, title = 'Lý do hủy đơn' }) {
  // Hooks must be called unconditionally (eslint rule). Keep them at top.
  const [reason, setReason] = React.useState(initialReason)

  React.useEffect(() => {
    setReason(initialReason)
  }, [initialReason, open])

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-40'>
      <div className='bg-white rounded p-6 w-full max-w-md'>
        <h3 className='text-lg font-semibold mb-2'>{title}</h3>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} className='w-full border rounded p-2 h-24' placeholder='Nhập lý do hủy...' />
        <div className='mt-4 flex justify-end gap-3'>
          <button onClick={() => { setReason(''); onClose && onClose() }} className='px-4 py-2 rounded border'>Huỷ</button>
          <button onClick={() => onSubmit && onSubmit(reason)} disabled={submitting || !reason || reason.trim().length === 0} className='px-4 py-2 rounded bg-red-600 text-white'>{submitting ? 'Đang...' : 'Gửi và hủy'}</button>
        </div>
      </div>
    </div>
  )
}
