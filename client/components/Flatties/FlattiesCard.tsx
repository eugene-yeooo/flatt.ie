import { useEffect, useState } from 'react'
import { getAllPayments } from '../../apis/payments'
import { updateCredit } from '../../apis/users'
import { Payment } from 'models/models'
import { usePayFromCredit } from '../../hooks/usePayment'
import useCanEdit from '../../hooks/useCanEdit'
import { Pencil } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

export type FlattieCardProps = {
  id: number
  name: string
  credit: number
  avatar_url?: string
}
export default function FlattieCard({
  id,
  name,
  credit,
  avatar_url,
}: FlattieCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [editedCredit, setEditedCredit] = useState(credit)
  const [isEditing, setIsEditing] = useState(false)
  const [showOverdueList, setShowOverdueList] = useState(false)
  const [unpaidExpenses, setUnpaidExpenses] = useState<Payment[]>([])
  const [overdueAmount, setOverdueAmount] = useState(0)
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null)

  const canEdit = useCanEdit()
  const { mutate: payFromCredit, isPending } = usePayFromCredit()
  const { getAccessTokenSilently } = useAuth0()
  async function fetchUnpaidExpenses() {
    const allPayments = await getAllPayments()
    const today = new Date()

    const filtered = allPayments.filter((p) => {
      const isUnpaid = Number(p.paid) === 0
      const isOverdue = new Date(p.dueDate) < today
      const userMatch = Number(p.userId) === Number(id)
      return isUnpaid && isOverdue && userMatch
    })

    setUnpaidExpenses(filtered)

    const total = filtered.reduce((sum, p) => sum + Number(p.amount), 0)
    setOverdueAmount(total)
  }

  // Fetch overdue data on mount
  useEffect(() => {
    fetchUnpaidExpenses()
  }, [])

  async function handleOverdueClick() {
    if (!showOverdueList) {
      await fetchUnpaidExpenses()
    }
    setShowOverdueList(!showOverdueList)
  }

  function handleConfirmPay(paymentId: number) {
    const payment = unpaidExpenses.find((p) => p.id === paymentId)
    if (!payment) return

    payFromCredit(paymentId, {
      onSuccess: () => {
        setEditedCredit((prev) => prev - payment.amount)
        fetchUnpaidExpenses()
        setPendingPaymentId(null)
      },
      onError: (err) => {
        console.error('Pay from credit failed:', err)
      },
    })
  }

  function handleCancel() {
    setIsEditing(false)
    setShowActions(false)
    setEditedCredit(credit)
  }

  async function handleSaveCredit() {
    try {
      const token = await getAccessTokenSilently()
      const updated = await updateCredit(editedCredit, token)

      if (updated) {
        setEditedCredit(updated.credit)
        setIsEditing(false)
        setShowActions(false)
      } else {
        alert('Failed to update credit.')
      }
    } catch (error) {
      console.error('Error saving credit:', error)
      alert('Something went wrong while saving credit.')
    }
  }
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Edit menu */}
      {canEdit && (
        <div className="absolute right-2 top-1">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Pencil size={18} />
          </button>
        </div>
      )}
      {/* Profile Photo */}
      <div className="mb-3 flex justify-center">
        <img
          src={avatar_url ? avatar_url : '/images/profilePhoto.png'}
          alt={avatar_url ? `${name}'s profile` : 'Default avatar'}
          className="mb-2 h-20 w-20 rounded-full object-cover"
        />
      </div>
      {/* Info */}
      {isEditing ? (
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <label className="text-gray-600">Credit:</label>
          <input
            type="number"
            className="rounded border p-1"
            value={editedCredit}
            onChange={(e) => setEditedCredit(Number(e.target.value))}
          />
        </div>
      ) : (
        <>
          <h3 className="text-center text-base font-semibold text-gray-900">
            {name}
          </h3>
          <p className="text-center text-sm text-gray-500">
            Credit: ${editedCredit.toFixed(2)}
          </p>
        </>
      )}
      {/* Buttons */}
      {isEditing ? (
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={handleSaveCredit}
            className="rounded-md border border-green-500 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-100"
          >
            Done
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md border border-gray-400 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      ) : (
        showActions && (
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-100"
            >
              Edit
            </button>
          </div>
        )
      )}
      {overdueAmount > 0 && (
        <div className="mt-3">
          <button
            onClick={handleOverdueClick}
            className="w-full rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-100"
          >
            Overdue: ${overdueAmount.toFixed(2)}
          </button>

          {showOverdueList && (
            <ul className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow">
              {unpaidExpenses.length === 0 ? (
                <li>No unpaid payments</li>
              ) : (
                unpaidExpenses.map((p) => (
                  <li
                    key={p.id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <span>
                      • {p.billTitle} (
                      {new Date(p.dueDate).toLocaleDateString()}): $
                      {p.amount.toFixed(2)}
                    </span>
                    {pendingPaymentId === p.id ? (
                      <div className="mt-1 flex w-full flex-col items-start gap-2 rounded border bg-gray-50 p-2">
                        <p className="text-xs text-gray-600">
                          Credit will be reduced by ${p.amount.toFixed(2)}
                        </p>
                        <div className="flex gap-2 self-end">
                          <button
                            onClick={() => handleConfirmPay(p.id)}
                            className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setPendingPaymentId(null)}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      canEdit && (
                        <button
                          onClick={() => setPendingPaymentId(p.id)}
                          disabled={isPending}
                          className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200"
                        >
                          {isPending ? '...' : 'Pay with Credit'}
                        </button>
                      )
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
