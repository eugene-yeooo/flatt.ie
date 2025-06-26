import { useState } from 'react'
import BillCard from './BillsCard'
import { Bill } from 'models/models'
import { useGetAllBills } from '../../hooks/useGetAllBills'

export default function Bills() {
  const { data: bills, isPending, error } = useGetAllBills()

  if (isPending) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error loading bills.</p>
  if (!bills || bills.length === 0)
    return <p className="p-4">No bills found.</p>
  console.log(bills)

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
            due_date={new Date(bill.due_date)}
            total_amount={bill.total_amount}
          />
        ))
      )}
    </div>
  )
}
