import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Flatmate, UpdateBillData } from 'models/models'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../../src/components/components/ui/tooltip'

type Share = {
  flatmateId: string
  split: string
  paid: boolean
}

type BillFormProps = {
  initialData?: Partial<UpdateBillData> & { payments?: Share[] }
  flatmates: Flatmate[]
  payments?: {
    paymentId: number
    amount: number
    split: number
    paid: boolean | number
    flatmateId: number
    flatmateName: string
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
  flatmates,
  onSubmit,
  onCancel,
  submitLabel,
}: BillFormProps) {
  const categories = ['Rent', 'Power', 'Internet', 'Rubbish']

  const [title, setTitle] = useState(initialData.title || '')
  const [dueDate, setDueDate] = useState(initialData.dueDate || '')
  const [totalAmount, setTotalAmount] = useState(
    initialData.totalAmount?.toString() || '',
  )
  const [expenseCategory, setExpenseCategory] = useState(
    initialData.expense_category || 'Power',
  )
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even')
  const [customSplitMode, setCustomSplitMode] = useState<'percent' | 'amount'>(
    'percent',
  )
  const [selectedFlatmateIds, setSelectedFlatmateIds] = useState<string[]>([])
  const [shares, setShares] = useState<Share[]>([])

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // 1. Initialization useEffect: only once
  useEffect(() => {
    if (!isInitialLoad) return

    if (initialData.payments && initialData.payments.length > 0) {
      const payments = initialData.payments

      setSplitType('custom')
      setCustomSplitMode('amount')
      const ids = payments.map((p) => String(p.flatmateId))
      setSelectedFlatmateIds(ids)

      const formattedShares: Share[] = payments.map((p) => ({
        flatmateId: String(p.flatmateId),
        split: Number(p.amount).toFixed(2),
        paid: Boolean(p.paid),
      }))

      setShares(formattedShares)
    } else {
      const allIds = flatmates.map((f) => String(f.id))
      setSelectedFlatmateIds(allIds)
      setSplitType('even')
      setCustomSplitMode('percent')

      const evenSplit = (100 / allIds.length).toFixed(2)
      const initialShares = allIds.map((id) => ({
        flatmateId: id,
        split: evenSplit,
        paid: false,
      }))

      setShares(initialShares)
    }

    setIsInitialLoad(false)
  }, [isInitialLoad, initialData, flatmates])

  // 2. When selected flatmates change, update shares
  useEffect(() => {
    if (isInitialLoad) return

    setShares((oldShares) => {
      const newShares: Share[] = selectedFlatmateIds.map((id) => {
        const existing = oldShares.find((s) => s.flatmateId === id)
        if (existing) return existing

        const defaultSplit =
          splitType === 'even'
            ? customSplitMode === 'percent'
              ? (100 / selectedFlatmateIds.length).toFixed(2)
              : (
                  (parseFloat(totalAmount) || 0) / selectedFlatmateIds.length
                ).toFixed(2)
            : '0'

        return {
          flatmateId: id,
          split: defaultSplit,
          paid: false,
        }
      })

      return newShares
    })
  }, [
    selectedFlatmateIds,
    splitType,
    customSplitMode,
    totalAmount,
    isInitialLoad,
  ])

  // 3. When splitType or customSplitMode changes, recalc splits if 'even'
  useEffect(() => {
    if (splitType === 'even' && selectedFlatmateIds.length > 0) {
      const newSplit =
        customSplitMode === 'percent'
          ? (100 / selectedFlatmateIds.length).toFixed(2)
          : (
              (parseFloat(totalAmount) || 0) / selectedFlatmateIds.length
            ).toFixed(2)

      setShares((oldShares) =>
        oldShares.map((s) => ({ ...s, split: newSplit })),
      )
    }
  }, [splitType, customSplitMode, selectedFlatmateIds, totalAmount])

  // Handlers
  function handleFlatmateToggle(id: string) {
    setSelectedFlatmateIds((old) =>
      old.includes(id) ? old.filter((fId) => fId !== id) : [...old, id],
    )
  }

  function handleSplitChange(index: number, value: string) {
    setShares((oldShares) => {
      const updated = [...oldShares]
      updated[index] = { ...updated[index], split: value }
      return updated
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !dueDate || !totalAmount) {
      alert('Please fill in required fields')
      return
    }

    if (selectedFlatmateIds.length === 0) {
      alert('Please select at least one flatmate to split the bill.')
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

    onSubmit({
      bill: {
        id: initialData.id,
        title,
        due_date: dueDate,
        total_amount: Number(totalAmount),
        expense_category: expenseCategory,
      },
      shares: shares.map((s) => ({
        ...s,
        split:
          customSplitMode === 'percent'
            ? (
                ((parseFloat(s.split) || 0) / 100) *
                parseFloat(totalAmount || '0')
              ).toFixed(2)
            : parseFloat(s.split).toFixed(2),
      })),
    })
  }

  // Render
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-[600px] flex-col overflow-y-auto rounded-md bg-white p-8 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{submitLabel}</h2>
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
        <label className="mb-2 block font-medium">
          Title <span className="text-red-500">*</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        {/* Due Date */}
        <label className="mb-2 block font-medium">
          Due Date <span className="text-red-500">*</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        {/* Total Amount */}
        <label className="mb-2 block font-medium">
          Total Amount $ <span className="text-red-500">*</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        {/* Expense Category */}
        <label className="mb-4 block font-medium">
          Expense Category <span className="text-red-500">*</span>
          <select
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
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
              <h4 className="text-md mb-2 font-medium">Split Type</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSplitType('even')}
                  className={`rounded px-4 py-2 text-sm font-medium ${
                    splitType === 'even'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Split Evenly
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`rounded px-4 py-2 text-sm font-medium ${
                    splitType === 'custom'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {splitType === 'custom' && (
              <div className="flex flex-col">
                <h4 className="text-md mb-2 font-medium">Custom Split Mode</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomSplitMode('percent')}
                    className={`rounded px-4 py-2 text-sm font-medium ${
                      customSplitMode === 'percent'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Split by %
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomSplitMode('amount')}
                    className={`rounded px-4 py-2 text-sm font-medium ${
                      customSplitMode === 'amount'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          <h4 className="mb-2 text-sm font-medium">
            Select Flatties to Include
          </h4>
          <div className="flex flex-wrap gap-2">
            {flatmates.map((f) => {
              const isSelected = selectedFlatmateIds.includes(String(f.id))
              const share = shares.find((s) => s.flatmateId === String(f.id))
              return share?.paid ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        key={f.id}
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded border bg-orange-500 px-4 py-1 text-sm text-white"
                      >
                        {f.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Already paid — cannot deselect.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFlatmateToggle(String(f.id))}
                  className={`rounded border px-4 py-1 text-sm ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {f.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* SPLIT INPUTS */}
        {splitType === 'custom' && selectedFlatmateIds.length > 0 && (
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
              {shares.map((share, index) => {
                const flatmate = flatmates.find(
                  (f) => String(f.id) === share.flatmateId,
                )
                return (
                  <div
                    key={share.flatmateId}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`w-20 truncate text-sm font-medium ${
                        share.paid ? 'text-gray-400 line-through' : ''
                      }`}
                    >
                      {flatmate?.name}:
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
                      value={share.split}
                      onChange={(e) => handleSplitChange(index, e.target.value)}
                      disabled={share.paid}
                      className={`w-20 rounded border px-2 py-1 text-sm focus:ring ${
                        share.paid
                          ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
                          : 'border-gray-300 focus:border-orange-500 focus:ring-orange-300'
                      }`}
                    />

                    {share.paid && (
                      <span className="ml-1 text-xs text-green-600">
                        (Paid)
                      </span>
                    )}

                    {customSplitMode === 'percent' && totalAmount && (
                      <span className="w-16 text-xs text-gray-500">
                        $
                        {(
                          ((parseFloat(share.split) || 0) / 100) *
                          parseFloat(totalAmount)
                        ).toFixed(2)}
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
          className="mx-auto mt-8 w-40 rounded-lg border border-gray-300 bg-primary px-6 py-2 font-semibold shadow transition duration-200 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
