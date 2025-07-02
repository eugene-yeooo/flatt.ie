import { useState } from 'react'
import AddPayment from './AddPaymentForm'
import BillsCardDropdown from './BillsCardDropdown'
import { Badge } from '@/components/components/ui/badge'
import { UpdateBillData } from 'models/models'
import clsx from 'clsx'
import useCanEdit from '../../hooks/useCanEdit'

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
  const badgeClass =
    (expenseCategory &&
      badgeColors[expenseCategory as keyof typeof badgeColors]) ||
    'bg-gray-100 text-gray-800'
  const canEdit = useCanEdit()
  return (
    <div
      className="relative rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md"
      style={{ backgroundColor: '#f8f3ee' }}
    >
      {/* Dropdown Menu */}
      <div className="absolute right-3 top-3">
        {' '}
        {/* pushed dropdown down */}
        <BillsCardDropdown
          id={id}
          setShowUpdateBill={setShowUpdateBill}
          setSelectedBill={setSelectedBill}
        />
      </div>

      {/* Category and unpaid badge */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--primary)]">{title}</h3>
        <div className={clsx('flex gap-1', canEdit ? 'pr-12' : '')}>
          {!paid && (
            <Badge
              variant="outline"
              className="w-fit rounded border border-red-500 bg-red-100 px-3 py-1.5 text-xs font-semibold uppercase text-red-500"
            >
              UNPAID
            </Badge>
          )}
          {expenseCategory && (
            <Badge
              variant="outline"
              className={clsx(
                'w-fit rounded border px-3 py-1.5 text-xs font-semibold uppercase',
                badgeClass,
              )}
            >
              {expenseCategory}
            </Badge>
          )}
        </div>
      </div>

      {/* Bill content */}
      <p className="mb-1 text-sm tracking-wide text-[var(--muted-foreground)]">
        <span className="font-semibold">Due:</span>{' '}
        {dueDate.toLocaleDateString()}
      </p>
      <p className="mb-4 text-sm font-semibold tracking-wide text-[var(--foreground)]">
        Total:{' '}
        <span className="text-[var(--primary)]">
          ${(totalAmount ?? 0).toFixed(2)}
        </span>
      </p>

      {unpaidFlatties.length > 0 && (
        <p className="text-sm font-semibold tracking-wide text-red-600">
          Unpaid by:{' '}
          <span className="font-normal">{unpaidFlatties.join(', ')}</span>
        </p>
      )}
    </div>
  )
}
