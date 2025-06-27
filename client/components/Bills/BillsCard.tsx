import { useState } from 'react'
import AddPayment from './AddPaymentForm'
import BillsCardDropdown from './BillsCardDropdown'
import { Badge } from '@/components/components/ui/badge'
import { UpdateBillData } from 'models/models'
interface BillCardProps {
  id: number
  title: string
  dueDate: Date
  totalAmount: number
  expenseCategory?: string
  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedBill: React.Dispatch<React.SetStateAction<UpdateBillData | null>>
}

export default function BillCard({
  id,
  title,
  dueDate,
  totalAmount,
  expenseCategory,
  setShowUpdateBill,
  setSelectedBill,
}: BillCardProps) {
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false)

  return (
    <div className="relative rounded-md bg-white p-4 shadow">
      {expenseCategory && (
        <Badge
          variant="secondary"
          className="absolute right-10 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase"
        >
          {expenseCategory}
        </Badge>
      )}
      <BillsCardDropdown
        id={id}
        title={title}
        dueDate={dueDate}
        totalAmount={totalAmount}
        expenseCategory={expenseCategory}
        setShowUpdateBill={setShowUpdateBill}
        setSelectedBill={setSelectedBill}
      />
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">Due: {dueDate.toLocaleString()}</p>
        <p className="text-sm text-gray-700">
          Amount: ${totalAmount.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setShowAddPaymentForm(true)}
          className="rounded-md border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50"
        >
          Add Payment
        </button>
      </div>

      {showAddPaymentForm && (
        <AddPayment
          billId={id}
          onClose={() => setShowAddPaymentForm(false)}
          flatmates={{
            id: 0,
            name: '',
          }}
          totalAmount={totalAmount}
        />
      )}
    </div>
  )
}
