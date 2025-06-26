import { useState } from 'react'
import BillCard from './BillsCard'
import { Bill } from 'models/models'

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

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <h1 className="mb-4 text-2xl font-bold">Bills</h1>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        bills.map((bill) => (
          <BillCard
            key={bill.id}
            id={bill.id}
            title={bill.title}
            due_date={bill.due_date}
            total_amount={bill.total_amount}
          />
        ))
      )}
    </div>
  )
}
