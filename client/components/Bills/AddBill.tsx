import { useState } from 'react'

type AddBillProps = {
  onAddBill: (bill: {
    title: string
    due_date: string
    total_amount: number
    expense_category: string
  }) => void
}

export default function AddBill({ onAddBill }: AddBillProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !dueDate || !totalAmount) {
      alert('Please fill in required fields')
      return
    }

    onAddBill({
      title,
      due_date: dueDate,
      total_amount: Number(totalAmount),
      expense_category: expenseCategory,
    })

    setTitle('')
    setDueDate('')
    setTotalAmount('')
    setExpenseCategory('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w rounded-md bg-white p-6 shadow-md"
    >
      <h2 className="mb-4 text-xl font-semibold">Add New Bill</h2>

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
        Total Amount <span className="text-red-500">*</span>
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
        Expense Category
        <input
          type="text"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          placeholder="e.g. Rent, Power, Internet"
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
        />
      </label>

      <button
        type="submit"
        className="inline-block rounded bg-primary px-6 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Add Bill
      </button>
    </form>
  )
}
