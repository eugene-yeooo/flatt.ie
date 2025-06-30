import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Flatmate, UpdateBillData } from 'models/models'

type Share = { flatmateId: string; split: string; paid: boolean }

type BillFormProps = {
  initialData?: Partial<UpdateBillData> & { payments?: Share[] }
  flatmates: Flatmate[]
  onSubmit: (data: {
    bill: {
      id?: number
      title: string
      due_date: string
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
  const [dueDate, setDueDate] = useState(initialData.due_date || '')
  const [totalAmount, setTotalAmount] = useState(
    initialData.total_amount?.toString() || '',
  )
  const [expenseCategory, setExpenseCategory] = useState(
    initialData.expense_category || 'Power',
  )
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even')
  const [customSplitMode, setCustomSplitMode] = useState<'percent' | 'amount'>(
    'percent',
  )
  const [shares, setShares] = useState<Share[]>([])
  const [selectedFlatmateIds, setSelectedFlatmateIds] = useState<string[]>([])

  // Initialize shares & selectedFlatmateIds from initialData/payments on mount
  useEffect(() => {
    if (initialData.payments?.length) {
      const ids = initialData.payments.map((p) => p.flatmateId)
      setSelectedFlatmateIds(ids)

      // Set shares from payments
      setShares(initialData.payments)
      setSplitType('custom')
    }
  }, [initialData.payments])

  // When selectedFlatmateIds change, update shares accordingly
  useEffect(() => {
    const updatedShares = selectedFlatmateIds.map((id) => {
      const existing = shares.find((s) => s.flatmateId === id)
      return (
        existing || {
          flatmateId: id,
          split: '0',
          paid: false,
        }
      )
    })

    if (splitType === 'even' && updatedShares.length > 0) {
      const evenSplit = (100 / updatedShares.length).toFixed(2)
      setShares(updatedShares.map((s) => ({ ...s, split: evenSplit })))
    } else {
      setShares(updatedShares)
    }
  }, [selectedFlatmateIds])

  // When splitType changes to even, recalc even split
  useEffect(() => {
    if (splitType === 'even' && selectedFlatmateIds.length > 0) {
      const evenSplit = (100 / selectedFlatmateIds.length).toFixed(2)
      setShares((oldShares) =>
        oldShares.map((s) => ({ ...s, split: evenSplit })),
      )
    }
  }, [splitType])

  function handleFlatmateToggle(id: string) {
    if (selectedFlatmateIds.includes(id)) {
      setSelectedFlatmateIds(selectedFlatmateIds.filter((fId) => fId !== id))
    } else {
      setSelectedFlatmateIds([...selectedFlatmateIds, id])
    }
  }

  function handleSplitChange(index: number, value: string) {
    const updated = [...shares]
    updated[index].split = value
    setShares(updated)
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
      shares,
    })
  }

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
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
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
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
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
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
          />
        </label>

        {/* Expense Category */}
        <label className="mb-4 block font-medium">
          Expense Category <span className="text-red-500">*</span>
          <select
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
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

        {/* SPLIT */}
        <div className="mb-4 mt-0">
          <div className="flex gap-10">
            {/* Split Type column */}
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

            {/* Custom Split Mode column (only when custom selected) */}
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

        {/* SELECT FLATTIES TO SPLIT */}
        <div>
          <h4 className="mb-2 text-sm font-medium">
            Select Flatties to Include
          </h4>
          <div className="flex flex-wrap gap-2">
            {flatmates.map((f) => {
              const isSelected = selectedFlatmateIds.includes(String(f.id))
              return (
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

        {/* SPLIT INPUT */}
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
                    <span className="w-20 truncate text-sm font-medium">
                      {flatmate?.name}:
                    </span>
                    <input
                      type="number"
                      step={customSplitMode === 'percent' ? '1' : '0.01'}
                      min="0"
                      placeholder={
                        customSplitMode === 'percent'
                          ? '% e.g. 25'
                          : '$ e.g. 45.50'
                      }
                      value={share.split}
                      onChange={(e) => handleSplitChange(index, e.target.value)}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring focus:ring-orange-300"
                    />
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
