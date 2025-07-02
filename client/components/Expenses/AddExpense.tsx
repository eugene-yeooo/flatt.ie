import { useAddExpense } from '../../hooks/useExpense'
import { useAddNewBill } from '../../hooks/useBills'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function AddExpense({
  onAddExpense,
}: {
  onAddExpense: () => void
}) {
  const [category, setCategory] = useState('')
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'one_off'>(
    'one_off',
  )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [defaultAmount, setDefaultAmount] = useState('')
  const [calcMethod, setCalcMethod] = useState<'split' | 'manual'>('split')
  const [notes, setNotes] = useState('')
  const mutation = useAddExpense()
  const billMutation = useAddNewBill()
  const frequencyOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'One Off', value: 'one_off' },
  ]
  const calcOptions = [
    { label: 'Split', value: 'split' },
    { label: 'Manual', value: 'manual' },
  ]

  function generateDueDates(
    start: string,
    end: string,
    frequency: 'weekly' | 'monthly',
  ): string[] {
    const dates: string[] = []
    const current = new Date(start)
    const last = new Date(end)

    while (current <= last) {
      dates.push(current.toISOString().split('T')[0])

      if (frequency === 'weekly') {
        current.setDate(current.getDate() + 7)
      } else if (frequency === 'monthly') {
        current.setMonth(current.getMonth() + 1)
      }
    }

    return dates
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category || !defaultAmount) {
      alert('Please fill in required fields')
      return
    }

    try {
      await mutation.mutateAsync({
        category,
        frequency,
        start_date: startDate,
        end_date: endDate,
        default_amount: Number(defaultAmount),
        calc_method: calcMethod,
        notes,
      })

      if (frequency !== 'one_off') {
        const dueDates = generateDueDates(startDate, endDate, frequency)

        for (const dueDate of dueDates) {
          const parsedDate = new Date(dueDate)

          if (frequency === 'weekly') {
            const weekLabel = parsedDate.toLocaleDateString('en-NZ', {
              day: 'numeric',
              month: 'long',
            })

            await billMutation.mutateAsync({
              title: `Week of ${weekLabel} ${category} Bill`,
              expense_category: category,
              due_date: dueDate,
              total_amount: Number(defaultAmount),
            })
          } else {
            const monthYear = parsedDate.toLocaleDateString('en-NZ', {
              month: 'long',
              year: 'numeric',
            })

            await billMutation.mutateAsync({
              title: `${monthYear} ${category} Bill`,
              expense_category: category,
              due_date: dueDate,
              total_amount: Number(defaultAmount),
            })
          }
        }
      }

      onAddExpense()
      setCategory('')
      setFrequency('one_off')
      setStartDate('')
      setEndDate('')
      setDefaultAmount('')
      setCalcMethod('split')
      setNotes('')
    } catch (error) {
      console.error('Error submitting expense and/or bill:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-[600px] flex-col justify-center rounded-md bg-white p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Expense</h2>
          <button
            type="button"
            onClick={onAddExpense}
            className="text-gray-400 hover:text-black"
            aria-label="Close form"
          >
            <X />
          </button>
        </div>

        <label className="mb-2 block font-medium">
          Category <span className="text-red-500">*</span>
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
            value={defaultAmount}
            onChange={(e) => setDefaultAmount(e.target.value)}
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
          className="hover:bg-primary/90 mt-2 rounded-lg bg-primary px-6 py-2 font-semibold shadow transition duration-200 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Add Expense
        </button>
      </form>
    </div>
  )
}
