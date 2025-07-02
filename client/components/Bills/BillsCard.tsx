import { useState } from 'react'
import AddPayment from './AddPaymentForm'
import BillsCardDropdown from './BillsCardDropdown'
import { Badge } from '@/components/components/ui/badge'
import { UpdateBillData } from 'models/models'
import clsx from 'clsx'

interface BillCardProps {
  id: number
  title: string
  dueDate: Date
  totalAmount: number
  expenseCategory?: string
  paid: boolean
  unpaidFlatties: string[]
  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedBill: React.Dispatch<React.SetStateAction<UpdateBillData | null>>
}

const badgeColors = {
  Rent: 'bg-blue-300 text-blue-800 border-blue-500',
  Power: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Internet: 'bg-purple-100 text-purple-800 border-purple-300',
  Rubbish: 'bg-teal-100 text-green-800 border-green-300',
}

export default function BillCard({
  id,
  title,
  dueDate,
  totalAmount,
  expenseCategory,
  paid,
  unpaidFlatties,
  setShowUpdateBill,
  setSelectedBill,
}: BillCardProps) {
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false)

  const badgeClass =
    (expenseCategory &&
      badgeColors[expenseCategory as keyof typeof badgeColors]) ||
    'bg-gray-100 text-gray-800'

  return (
    <div className="relative rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md" style={{ backgroundColor: '#f8f3ee' }}>
      {/* Dropdown Menu */}
      <div className="absolute right-2 top-1">
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

      {/* Category and unpaid badge */}
      <div className="flex gap-2">
        {expenseCategory && (
          <Badge
            variant="outline"
            className={clsx(
              'mb-1 w-fit rounded border px-2 py-0.5 text-xs font-semibold uppercase',
              badgeClass,
            )}
          >
            {expenseCategory}
          </Badge>
        )}
        {!paid && (
          <Badge
            variant="outline"
            className="mb-1 w-fit rounded border border-red-500 bg-red-100 px-2 py-0.5 text-xs font-semibold uppercase text-red-500"
          >
            UNPAID
          </Badge>
        )}
      </div>

      {/* Bill content */}
      <h3 className="mb-0.5 text-base font-semibold" style={{ color: '#774136' }}>{title}</h3>
      <p className="text-sm text-gray-500">
        Due: {dueDate.toLocaleDateString()}
      </p>
      <p className="mt-0.5 text-sm font-medium text-gray-700">
        Total: ${totalAmount.toFixed(2)}
      </p>
      {unpaidFlatties.length > 0 && (
        <p className="mt-1 text-sm font-semibold text-red-500">
          Unpaid by: {unpaidFlatties.join(', ')}
        </p>
      )}

      {/* Actions */}
      {/* <div className="mt-3 flex justify-end">
        <button
          onClick={() => setShowAddPaymentForm(true)}
          className="rounded-md border border-orange-500 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
        >
          Add Payment
        </button>
      </div> */}

      {/* Payment form
      {showAddPaymentForm && (
        <AddPayment
          billId={id}
          onClose={() => setShowAddPaymentForm(false)}
          flatmates={{ id: 0, name: '' }}
          totalAmount={totalAmount}
        />
      )}*/}
    </div>
  )
}
