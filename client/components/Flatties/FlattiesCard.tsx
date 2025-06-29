import { useState } from "react"
import { getAllPayments } from "../../apis/payments"
import { Payment } from "models/models"

interface FlattieCardProps {
  name: string
  credit: number
  overdue?: number
  profilePhoto?: string
  onDelete?: () => void
}

export default function FlattieCard({ name, credit, overdue, profilePhoto, onDelete }: FlattieCardProps) {
  const balance = credit - (overdue ?? 0)
  const balanceColor =
    balance > 0
      ? 'text-green-600'
      : balance < 0
        ? 'text-red-600'
        : 'text-muted-foreground'
  
  const [showModal, setShowModal] = useState(false)
  const [unpaidExpenses, setUnpaidExpenses] = useState<Payment[]>([])

  async function handleOverdueClick() {
    const allPayments = await getAllPayments()
    const filtered = allPayments.filter(p => Number(p.paid) === 0)
    setUnpaidExpenses(filtered)
    setShowModal(true)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <img src={profilePhoto ? `http://localhost:3000${profilePhoto}` : '/images/profilePhoto.png'} alt={profilePhoto ? `${name}'s profile` : 'Default avatar'} className="w-20 h-20 rounded-full object-cover mb-2" />
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="text-sm text-muted-foreground">
        Credit: ${credit.toFixed(2)}
      </div>
      <div className={`mt-1 text-sm font-medium ${balanceColor}`}>
        Balance: ${balance.toFixed(2)}
      </div>
      <div className="mt-3 flex gap-2">
      {typeof overdue === 'number' && overdue > 0 && (
        <button onClick={handleOverdueClick} className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200">
          Overdue: ${overdue.toFixed(2)}
        </button>
      )}
      {onDelete && (
      <button onClick={onDelete} className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200">
        Delete
      </button>
      )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-bold mb-2">Unpaid Expenses</h3>
            <ul className="text-sm text-gray-800">
              {unpaidExpenses.length === 0 ? (
                <li>No unpaid payments</li>
              ) : (
                unpaidExpenses.map((p) => (
                  <li key={p.id}>
                    • {p.billTitle} ({new Date(p.dueDate).toLocaleDateString()}): ${p.amount.toFixed(2)}
                  </li>
                ))
              )}
            </ul>
            <button onClick={() => setShowModal(false)} className="mt-4 text-blue-500 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
