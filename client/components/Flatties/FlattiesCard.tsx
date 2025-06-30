import { ChangeEvent, useState } from "react"
import { getAllPayments } from "../../apis/payments"
import { Payment } from "models/models"
import { usePayFromCredit } from "../../hooks/usePayment"

interface FlattieCardProps {
  id: number
  name: string
  credit: number
  overdue?: number
  profilePhoto?: string
  onDelete?: () => void
  onUpdate?: (id: number, updated: { name: string; credit: number; profilePhoto?: File | null }) => void
}

export default function FlattieCard({ id, name, credit, overdue, profilePhoto, onDelete, onUpdate }: FlattieCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showOverdueList, setShowOverdueList] = useState(false)
  const [unpaidExpenses, setUnpaidExpenses] = useState<Payment[]>([])
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null)

  const [editedName, setEditedName] = useState(name)
  const [editedCredit, setEditedCredit] = useState(credit)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)

  const balance = credit - (overdue ?? 0)
  const balanceColor =
    balance > 0
      ? 'text-green-600'
      : balance < 0
        ? 'text-red-600'
        : 'text-muted-foreground'
  const { mutate: payFromCredit, isPending } = usePayFromCredit()

  async function fetchUnpaidExpenses() {
    const allPayments = await getAllPayments()
    const today = new Date()
    const filtered = allPayments.filter((p) => {
      const isUnpaid = Number(p.paid) === 0
      const isOverdue = new Date(p.dueDate) < today
      return isUnpaid && isOverdue && p.flattieId === id
    })
    setUnpaidExpenses(filtered)
  }

  async function handleOverdueClick() {
    if (!showOverdueList) {
      await fetchUnpaidExpenses()
    }
    setShowOverdueList(!showOverdueList)
  }

function handleConfirmPay(paymentId: number) {
       payFromCredit(paymentId, {
      onSuccess: () => {
        fetchUnpaidExpenses()
        setPendingPaymentId(null)
      },
      onError: (err) => {
        console.error('Pay from credit failed:', err)
      },
    })
  }

  function handleDeleteConfirm() {
    const confirmed = confirm(`Are you sure you want to delete ${name}?`)
    if (confirmed && onDelete) {
      onDelete()
    }
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0])
    }
  }

  function handleSave() {
    if (onUpdate) {
      onUpdate(id, {
        name: editedName,
        credit: editedCredit,
        profilePhoto: newPhoto,
      })
    }
    setIsEditing(false)
    setShowActions(false)
  }

  function handleCancel() {
    setIsEditing(false)
    setShowActions(false)
    setEditedName(name)
    setEditedCredit(credit)
    setNewPhoto(null)
  }

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Edit menu */}
      <div className="absolute right-2 top-1">
      <button onClick={() => setShowActions(!showActions)} className="text-gray-400 hover:text-gray-600">✏️</button>
      </div>
      {/* Profile Photo */}
      <div className="mb-3 flex justify-center">
        {isEditing ? (
          <div className="flex flex-col items-center">
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {newPhoto && <p className="text-xs text-gray-500 mt-1">{newPhoto.name}</p>}
          </div>
        ) : (
        <img src={profilePhoto ? `http://localhost:3000${profilePhoto}` : '/images/profilePhoto.png'} alt={profilePhoto ? `${name}'s profile` : 'Default avatar'} className="w-20 h-20 rounded-full object-cover mb-2" />
        )}
      </div>
      {/* Info */}
      {isEditing ? (
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <input className="border rounded p-1" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
          <input type="number" className="border rounded p-1" value={editedCredit} onChange={(e) => setEditedCredit(Number(e.target.value))} />
        </div>
      ) : (
        <>
        <h3 className="text-base font-semebold text-gray-900 text-center">{name}</h3>
        <p className="text-sm text-gray-500 text-center">Credit: ${credit.toFixed(2)}</p>
        <p className={`mt-1 text-sm font-medium text-center ${balanceColor}`}>Balance: ${balance.toFixed(2)}</p>
        </>
      )}
      {/* Buttons */}
      {isEditing ? (
        <div className="mt-3 flex justify-center gap-2">
          <button onClick={handleSave} className="rounded-md border border-green-500 bg-green-50 px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-100">Save</button>
          <button onClick={handleCancel} className="rounded-md border border-gray-400 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
        </div>
      ) : (
        showActions && (
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={() => setIsEditing(true)} className="rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-100">Edit</button>
            <button onClick={handleDeleteConfirm} className="rounded-md border border-red-500 bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100">Delete</button>
          </div>
        )
      )}
      {/* Overdue */}
      {typeof overdue === 'number' && overdue > 0 && (
        <div className="mt-3">
          <button
            onClick={handleOverdueClick}
            disabled={!overdue || overdue <= 0}
            className={`w-full rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium ${
            overdue && overdue > 0
              ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100'
              : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}>
            Overdue: ${overdue.toFixed(2) ?? '0.00'}
          </button>
      {/*Dropdown unpaid list*/}
      {showOverdueList && (
            <ul className="mt-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow">
              {unpaidExpenses.length === 0 ? (
                <li>No unpaid payments</li>
              ) : (
                unpaidExpenses.map((p) => (
                  <li key={p.id} className="mb-2 flex justify-between items-center">
                    <span>
                    • {p.billTitle} ({new Date(p.dueDate).toLocaleDateString()}): ${p.amount.toFixed(2)}
                    </span>
                    {pendingPaymentId === p.id ? (
                      <div className="mt-1 rounded border bg-gray-50 p-2 flex flex-col gap-2 items-start w-full">
                        <p className="text-xs text-gray-600">Credit will be reduced by ${p.amount.toFixed(2)}</p>
                        <div className="flex gap-2 self-end">
                        <button onClick={() => handleConfirmPay(p.id)} className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200">Confirm</button>
                        <button onClick={() => setPendingPaymentId(null)} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300">Cancel</button>
                      </div>
                      </div>
                    ) : (
                      <button onClick={() => setPendingPaymentId(p.id)} disabled={isPending} className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 hover:bg-blue-200">{isPending ? '...' : '💸'}</button>
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