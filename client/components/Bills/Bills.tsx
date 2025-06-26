import { useState } from 'react'
import BillCard from './BillsCard'
import { Bill } from 'models/models'
import AddBill from './AddBill'

export default function Bills() {
  // Example hardcoded bills - replace with fetch later
  const [bills] = useState<Bill[]>([
    {
      id: 1,
      title: 'Rent June 2025',
      due_date: new Date('2025-06-30'),
      total_amount: 620,
      expense_category: 'rent',
    },
    {
      id: 2,
      title: 'Power May 2025',
      due_date: new Date('2025-05-31'),
      total_amount: 163.24,
      expense_category: 'power',
    },
    {
      id: 3,
      title: 'Internet June 2025',
      due_date: new Date('2025-06-01'),
      total_amount: 85,
      expense_category: 'internet',
    },
  ])

  const [showAddBill, setShowAddBill] = useState(false)

  function toggleAddBill() {
    setShowAddBill((prev) => !prev)
  }
  //add a new bill to the state
  function handleAddBill(newBill: Omit<Bill, 'id'>) {
    const newId = bills.length ? bills[bills.length - 1].id + 1 : 1
    const dueDate = new Date(newBill.due_date)
    setBills([...bills, { id: newId, ...newBill, due_date: dueDate }])
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <button
        onClick={toggleAddBill}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        {showAddBill ? 'Cancel' : 'Add Bill'}
      </button>
      {showAddBill && <AddBill onAddBill={handleAddBill} />}

      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              id={bill.id}
              title={bill.title}
              due_date={bill.due_date}
              total_amount={bill.total_amount}
              expense_category={bill.expense_category}
            />
          ))}
        </div>
      )}
    </div>
  )
}
