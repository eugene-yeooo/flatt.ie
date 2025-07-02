import { useAddExpense } from '../../hooks/useExpense'
import { useAddNewBill } from '../../hooks/useBills'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useAddPayments } from '../../hooks/usePayment'
import { useAllUsers } from '../../hooks/useUser'

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
  const createPayments = useAddPayments()
  const { data: users, isPending, error } = useAllUsers()

  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error loading users</p>

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
      // Step 1: Create the expense
      await mutation.mutateAsync({
        category,
        frequency,
        start_date: startDate,
        end_date: endDate,
        default_amount: Number(defaultAmount),
        calc_method: calcMethod,
        notes,
      })

      // Step 2: Generate bills if recurring
      if (frequency !== 'one_off') {
        const dueDates = generateDueDates(startDate, endDate, frequency)

        for (const dueDate of dueDates) {
          const parsedDate = new Date(dueDate)

          const title =
            frequency === 'weekly'
              ? `Week of ${parsedDate.toLocaleDateString('en-NZ', {
                  day: 'numeric',
                  month: 'long',
                })} ${category} Bill`
              : `${parsedDate.toLocaleDateString('en-NZ', {
                  month: 'long',
                  year: 'numeric',
                })} ${category} Bill`

          const totalAmount = Number(defaultAmount)

          const billId = await billMutation.mutateAsync({
            title,
            expense_category: category,
            due_date: dueDate,
            total_amount: totalAmount,
          })

          // Step 3: Generate payment splits
          const userIds = users?.map((u) => u.user_id)
          const percent = 100 / userIds.length

          const payments = userIds.map((userId) => ({
            user_id: userId,
            split: percent / 100,
            amount: (percent / 100) * totalAmount,
            paid: false,
          }))

          await createPayments.mutateAsync({ billId, payments })
        }
      }

      // Step 3: Cleanup and close
      onAddExpense()
      setCategory('')
      setFrequency('one_off')
      setStartDate('')
      setEndDate('')
      setDefaultAmount('')
      setCalcMethod('split')
      setNotes('')
    } catch (error) {
      console.error('Error submitting expense or bills:', error)
      alert('Something went wrong while saving the expense.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-[600px] flex-col justify-center rounded-xl p-6 shadow transition-colors"
        style={{ backgroundColor: 'var(--primary-foreground)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#7b3f35]">
            Add New Expense
          </h2>
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
          className="mt-2 rounded-lg border border-gray-300 bg-[var(--card)] px-6 py-2 font-semibold text-[var(--primary)] shadow transition duration-200 hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Add Expense
        </button>
      </form>
    </div>
  )
}
