import { useUpdateExpense } from '../../hooks/useExpense'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Expense } from 'models/models'

export default function UpdateExpense({
  expense,
  setShowUpdateExpense,
}: {
  expense: Expense
  setShowUpdateExpense: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [category, setCategory] = useState(expense.category)
  const [frequency, setFrequency] = useState(expense.frequency)
  const [startDate, setStartDate] = useState(expense.start_date)
  const [endDate, setEndDate] = useState(expense.end_date)
  const [defaultAmount, setDefaultAmount] = useState(expense.default_amount)
  const [calcMethod, setCalcMethod] = useState(expense.calc_method)
  const [notes, setNotes] = useState(expense.notes)
  const mutation = useUpdateExpense()
  const frequencyOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'One Off', value: 'one_off' },
  ]
  const calcOptions = [
    { label: 'Split', value: 'split' },
    { label: 'Manual', value: 'manual' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category || !defaultAmount) {
      alert('Please fill in required fields')
      return
    }

    mutation.mutate({
      id: expense.id,
      category,
      frequency,
      start_date: startDate,
      end_date: endDate,
      default_amount: Number(defaultAmount),
      calc_method: calcMethod,
      notes,
    })
    setCategory('')
    setFrequency('one_off')
    setStartDate('')
    setEndDate('')
    setDefaultAmount(0)
    setCalcMethod('split')
    setNotes('')
    setShowUpdateExpense(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-[600px] flex-col justify-center rounded-md bg-[var(--card)] p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Update Expense</h2>
          <button
            type="button"
            onClick={() => setShowUpdateExpense(false)}
            className="text-gray-400 hover:text-black"
            aria-label="Close form"
          >
            <X />
          </button>
        </div>

        <label className="mb-2 block font-medium">
          Title <span className="text-red-500">*</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        <label className="mb-4 block font-medium">
          Payment Frequency <span className="text-red-500">*</span>
          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as 'weekly' | 'monthly' | 'one_off')
            }
            // placeholder="e.g. Rent, Power, Internet"
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          >
            <option value="" disabled>
              Select payment frequency
            </option>
            {frequencyOptions.map((frequency) => (
              <option key={frequency.value} value={frequency.value}>
                {frequency.label}
              </option>
            ))}
          </select>
        </label>

        {['weekly', 'monthly'].includes(frequency) && (
          <>
            <label className="mb-2 block font-medium">
              Start Date <span className="text-red-500">*</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
              />
            </label>
            <label className="mb-2 block font-medium">
              End Date <span className="text-red-500">*</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
              />
            </label>
          </>
        )}

        <label className="mb-2 block font-medium">
          Total Amount <span className="text-red-500">*</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={Number(defaultAmount)}
            onChange={(e) => setDefaultAmount(Number(e.target.value))}
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        <label className="mb-4 block font-medium">
          Calc Method <span className="text-red-500">*</span>
          <select
            value={calcMethod}
            onChange={(e) =>
              setCalcMethod(e.target.value as 'split' | 'manual')
            }
            // placeholder="e.g. Rent, Power, Internet"
            required
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          >
            <option value="" disabled>
              Select split method
            </option>
            {calcOptions.map((calcmethod) => (
              <option key={calcmethod.value} value={calcmethod.value}>
                {calcmethod.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-2 block font-medium">
          Notes
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="focus:ring-primary/50 mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-lg border border-gray-300 bg-[var(--card)] px-6 py-2 font-semibold text-[var(--primary)] shadow transition duration-200 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Add Expense
        </button>
      </form>
    </div>
  )
}
