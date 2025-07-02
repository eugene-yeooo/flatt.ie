import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Share, UpdateBillData, User } from 'models/models'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../../src/components/components/ui/tooltip'

type BillFormProps = {
  initialData?: Partial<UpdateBillData> & { payments?: Share[] }
  users: User[]
  payments?: {
    paymentId: number
    amount: number
    split: number
    paid: boolean | number
    userId: number
    userName: string
  }[]
  onSubmit: (data: {
    bill: {
      id?: number
      title: string
      due_date: string | Date
      total_amount: number
      expense_category: string
    }
    shares: Share[]
  }) => void
  onCancel: () => void
  submitLabel: string
}

export default function BillForm({
  initialData = {},
  users,
  onSubmit,
  onCancel,
  submitLabel,
}: BillFormProps) {
  const categories = ['Rent', 'Power', 'Internet', 'Rubbish']

  const [title, setTitle] = useState(initialData.title || '')
  const [dueDate, setDueDate] = useState(initialData.dueDate || '')
  const [totalAmount, setTotalAmount] = useState(
    typeof initialData.totalAmount === 'number' ? initialData.totalAmount : '',
  )

  const [expenseCategory, setExpenseCategory] = useState(
    initialData.expenseCategory || 'Power',
  )
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even')
  const [customSplitMode, setCustomSplitMode] = useState<'percent' | 'amount'>(
    'percent',
  )
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [shares, setShares] = useState<Share[]>([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Initialization useEffect: only once
  useEffect(() => {
    if (!isInitialLoad) return

    if (initialData.payments && initialData.payments.length > 0) {
      const payments = initialData.payments

      setSplitType('custom')
      setCustomSplitMode('amount')
      const ids = payments.map((p) => p.userId)
      setSelectedUserIds(ids)

      const formattedShares = payments.map((p) => ({
        userId: p.userId,
        split: Number(p.amount),
        paid: Boolean(p.paid),
      }))

      setShares(formattedShares)
    } else {
      const allIds = users.map((u) => u.user_id)

      setSelectedUserIds(allIds)
      setSplitType('even')
      setCustomSplitMode('percent')

      const evenSplit = 100 / allIds.length
      const initialShares = allIds.map((id) => ({
        userId: id,
        split: evenSplit,
        paid: false,
      }))

      setShares(initialShares)
    }

    setIsInitialLoad(false)
  }, [isInitialLoad, initialData, users])

  // When splitType or customSplitMode changes, recalc splits if 'even'
  useEffect(() => {
    if (splitType !== 'even' || selectedUserIds.length === 0) return

    const parsedAmount = parseFloat(String(totalAmount))
    const isAmountValid = !isNaN(parsedAmount)

    const newShares: Share[] = selectedUserIds.map((id) => {
      const split =
        customSplitMode === 'percent'
          ? 100 / selectedUserIds.length
          : isAmountValid
            ? parsedAmount / selectedUserIds.length
            : 0

      return {
        userId: id,
        split: Number(split.toFixed(2)), // ensures `split` is a number
        paid: false,
      }
    })

    setShares(newShares)
  }, [splitType, customSplitMode, selectedUserIds, totalAmount])

  // Handlers
  function handleUserToggle(id: number) {
    setSelectedUserIds((prevIds) => {
      const isSelected = prevIds.includes(id)
      const newIds = isSelected
        ? prevIds.filter((fId) => fId !== id)
        : [...prevIds, id]

      setShares((prevShares) => {
        // If deselecting, remove the share
        if (isSelected) {
          return prevShares.filter((s) => s.userId !== id)
        }

        // If selecting, add new share with default value
        const defaultSplit =
          splitType === 'even'
            ? customSplitMode === 'percent'
              ? (100 / newIds.length).toFixed(2)
              : ((parseFloat(totalAmount) || 0) / newIds.length).toFixed(2)
            : '0'

        return [
          ...prevShares,
          { userId: id, split: Number(defaultSplit), paid: false },
        ]
      })

      return newIds
    })
  }

  function handleSplitChange(userId: number, value: string) {
    setShares((prevShares) =>
      prevShares.map((s) => (s.userId === userId ? { ...s, split: value } : s)),
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !dueDate || !totalAmount) {
      alert('Please fill in required fields')
      return
    }

    if (selectedUserIds.length === 0) {
      alert('Please select at least one user to split the bill.')
      return
    }

    const totalSplit = shares.reduce(
      (sum, s) => sum + (parseFloat(s.split) || 0),
      0,
    )

    if (splitType === 'custom') {
      if (customSplitMode === 'percent' && Math.abs(totalSplit - 100) > 0.01) {
        alert('Total split percentages must add up to 100%.')
        return
      }

      if (customSplitMode === 'amount') {
        const total = parseFloat(totalAmount)
        if (Math.abs(totalSplit - total) > 0.01) {
          alert(`Total split amounts must add up to $${total.toFixed(2)}.`)
          return
        }
      }
    }

    // console.log(
    //   'Submitting shares:',
    //   shares.map((s) => {
    //     const splitValue =
    //       typeof s.split === 'string' ? parseFloat(s.split) : s.split
    //     const total = Number(totalAmount)

    //     const amount =
    //       customSplitMode === 'percent'
    //         ? (splitValue / 100) * total
    //         : splitValue

    //     const percent =
    //       customSplitMode === 'percent'
    //         ? splitValue
    //         : (splitValue / total) * 100

    //     return {
    //       userId: s.userId,
    //       amount: Number(amount.toFixed(2)),
    //       split: Number(percent.toFixed(2)),
    //       paid: s.paid,
    //     }
    //   }),
    // )

    onSubmit({
      bill: {
        id: initialData.id,
        title,
        due_date:
          typeof dueDate === 'string'
            ? dueDate
            : (dueDate as Date).toISOString(),
        total_amount: Number(totalAmount),
        expense_category: expenseCategory,
      },
      shares: shares.map((s) => {
        const split =
          typeof s.split === 'string' ? parseFloat(s.split) : s.split
        const total =
          typeof totalAmount === 'string'
            ? parseFloat(totalAmount)
            : totalAmount

        let amount = 0
        let percent = 0

        if (customSplitMode === 'percent') {
          percent = split
          amount = (split / 100) * total
        } else {
          amount = split
          percent = (split / total) * 100
        }

        return {
          userId: s.userId,
          amount: parseFloat(amount.toFixed(2)),
          split: parseFloat(percent.toFixed(2)),
          paid: s.paid,
        }
      }),
    })
  }

  // Render
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-[600px] flex-col overflow-y-auto rounded-md bg-[#f9f3ee] p-8 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#78350f]">
            {submitLabel}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-black"
            aria-label="Close form"
          >
            <X />
          </button>
        </div>

        {/* Title */}
        <label className="mb-2 block font-medium text-[#78350f]">
          Title <span className="text-red-500">*</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </label>

        {/* Due Date */}
        <label className="mb-2 block font-medium text-[#78350f]">
          Due Date <span className="text-red-500">*</span>
          <input
            type="date"
            value={dueDate as string}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </label>

        {/* Total Amount */}
        <label className="mb-2 block font-medium text-[#78350f]">
          Total Amount $ <span className="text-red-500">*</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={totalAmount ?? ''}
            onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </label>

        {/* Expense Category */}
        <label className="mb-4 block font-medium text-[#78350f]">
          Expense Category <span className="text-red-500">*</span>
          <select
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {/* SPLIT TYPE */}
        <div className="mb-4 mt-0">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <h4 className="text-md mb-2 font-medium text-[#78350f]">
                Split Type
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSplitType('even')}
                  className={`rounded px-4 py-2 text-sm font-medium ${
                    splitType === 'even'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-[var(--primary)] hover:text-white'
                  }`}
                >
                  Split Evenly
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`rounded px-4 py-2 text-sm font-medium ${
                    splitType === 'custom'
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-[var(--primary)] hover:text-white'
                  }`}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {splitType === 'custom' && (
              <div className="flex flex-col">
                <h4 className="text-md mb-2 font-medium text-[#78350f]">
                  Custom Split Mode
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomSplitMode('percent')}
                    className={`rounded px-4 py-2 text-sm font-medium ${
                      customSplitMode === 'percent'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    Split by %
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomSplitMode('amount')}
                    className={`rounded px-4 py-2 text-sm font-medium ${
                      customSplitMode === 'amount'
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-[var(--primary)] hover:text-white'
                    }`}
                  >
                    Split by $
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SELECT FLATMATES */}
        <div>
          <h4 className="text-md mb-2 font-medium text-[#78350f]">
            Select Flatties to Include
          </h4>
          <div className="flex flex-wrap gap-2">
            {users.map((u) => {
              const isSelected = selectedUserIds.includes(u.user_id)
              const share = shares.find((s) => s.userId === u.user_id)

              const button = share?.paid ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded border bg-[var(--primary)] px-4 py-1 text-sm text-white"
                      >
                        {u.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Already paid — cannot deselect.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <button
                  type="button"
                  onClick={() => handleUserToggle(u.user_id)}
                  className={`rounded border px-4 py-1 text-sm ${
                    isSelected
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-[var(--primary)] hover:text-white'
                  }`}
                >
                  {u.name}
                </button>
              )

              return <div key={u.user_id}>{button}</div>
            })}
          </div>
        </div>

        {/* SPLIT INPUTS */}
        {splitType === 'custom' && selectedUserIds.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="mb-2 flex items-center gap-4 text-sm font-medium">
              <span>
                Enter splits{' '}
                {customSplitMode === 'percent'
                  ? '(Total must equal 100%)'
                  : totalAmount
                    ? `(Total must equal $${parseFloat(totalAmount).toFixed(2)})`
                    : ''}
              </span>
              <span>|</span>
              <span className="text-gray-600">
                {(() => {
                  const totalSplit = shares.reduce(
                    (sum, s) => sum + (parseFloat(s.split) || 0),
                    0,
                  )

                  if (customSplitMode === 'percent') {
                    const remaining = 100 - totalSplit
                    return (
                      <span
                        className={
                          remaining !== 0 ? 'text-red-500' : 'text-green-600'
                        }
                      >
                        Remaining: {remaining.toFixed(2)}%
                      </span>
                    )
                  }

                  if (customSplitMode === 'amount') {
                    const total = parseFloat(totalAmount) || 0
                    const remaining = total - totalSplit
                    return (
                      <span
                        className={
                          remaining !== 0 ? 'text-red-500' : 'text-green-600'
                        }
                      >
                        Remaining: ${remaining.toFixed(2)}
                      </span>
                    )
                  }

                  return null
                })()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {selectedUserIds.map((userId) => {
                const share = shares.find((s) => s.userId === userId)
                const user = users.find((u) => u.user_id === userId)

                if (!share || !user) return null

                return (
                  <div key={userId} className="flex items-center gap-2">
                    <span
                      className={`w-20 truncate text-sm font-medium ${
                        share.paid ? 'text-gray-400 line-through' : ''
                      }`}
                    >
                      {user.name}:
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={
                        customSplitMode === 'percent'
                          ? '% e.g. 25'
                          : '$ e.g. 45.50'
                      }
                      value={parseFloat(share.split) || ''}
                      onChange={(e) =>
                        handleSplitChange(userId, e.target.value)
                      }
                      disabled={share.paid}
                      className={`w-20 rounded border px-2 py-1 text-sm focus:ring ${
                        share.paid
                          ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
                          : 'border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)]'
                      }`}
                    />
                    {share.paid && (
                      <span className="ml-1 text-xs text-green-600">
                        (Paid)
                      </span>
                    )}

                    {customSplitMode === 'percent' && totalAmount && (
                      <span className="w-16 text-xs text-gray-500">
                        ${(((share.split || 0) / 100) * totalAmount).toFixed(2)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="mx-auto mt-8 w-40 rounded-lg border border-gray-300 bg-[var(--primary)] px-6 py-2 font-semibold text-white shadow transition duration-200 hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
