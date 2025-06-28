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
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Dropdown Menu */}
      <div className="absolute right-3 top-3">
        <BillsCardDropdown
          id={id}
          title={title}
          dueDate={dueDate}
          totalAmount={totalAmount}
          expenseCategory={expenseCategory}
          setShowUpdateBill={setShowUpdateBill}
          setSelectedBill={setSelectedBill}
        />
      </div>

      {/* Category badge */}
      {expenseCategory && (
        <Badge
          variant="outline"
          className="mb-1 w-fit rounded-full border bg-gray-50 px-2 py-0.5 text-xs uppercase text-gray-600"
        >
          {expenseCategory}
        </Badge>
      )}

      {/* Bill content */}
      <h3 className="mb-0.5 text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500">
        Due: {dueDate.toLocaleDateString()}
      </p>
      <p className="mt-0.5 text-sm font-medium text-gray-700">
        Total: ${totalAmount.toFixed(2)}
      </p>

      {/* Actions */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setShowAddPaymentForm(true)}
          className="rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
        >
          Add Payment
        </button>
      </div>

      {/* Payment form */}
      {showAddPaymentForm && (
        <AddPayment
          billId={id}
          onClose={() => setShowAddPaymentForm(false)}
          flatmates={{ id: 0, name: '' }}
          totalAmount={totalAmount}
        />
      )}
    </div>
  )
}
