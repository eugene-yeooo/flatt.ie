import { useUpdateBill } from '../../hooks/useBills'
import { useState } from 'react'
import { X } from 'lucide-react'
import { UpdateBillData } from 'models/models'

export default function UpdateBill({
  bill,
  setShowUpdateBill,
}: {
  bill: UpdateBillData
  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [title, setTitle] = useState(bill.title)
  const [dueDate, setDueDate] = useState(bill.due_date)
  const [totalAmount, setTotalAmount] = useState(bill.total_amount)
  const [expenseCategory, setExpenseCategory] = useState(bill.expense_category)
  const mutation = useUpdateBill()
  const categories = ['Rent', 'Power', 'Internet', 'Rubbish']

  console.log(bill)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !dueDate || !totalAmount) {
      alert('Please fill in required fields')
      return
    }

    mutation.mutate({
      id: bill.id,
      title,
      due_date: dueDate,
      total_amount: Number(totalAmount),
      expense_category: expenseCategory,
    })
    setShowUpdateBill(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center rounded-md bg-white p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Update Bill</h2>
          <button
            type="button"
            onClick={() => setShowUpdateBill(false)}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
          />
        </label>

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

        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary px-6 py-2 font-semibold shadow transition duration-200 hover:bg-orange-500 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Update Bill
        </button>
      </form>
    </div>
  )
}
