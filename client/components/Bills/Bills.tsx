import BillCard from './BillsCard'
import { useGetAllBills } from '../../hooks/useBills'
import AddBill from './AddBill'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'

export default function Bills() {
  const { data: bills, isPending, error } = useGetAllBills()
  const [showAddBill, setShowAddBill] = useState(false)

  function toggleAddBill() {
    setShowAddBill((prev) => !prev)
  }

  if (isPending) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error loading bills.</p>
  if (!bills || bills.length === 0)
    return (
      <div className="p-4">
        <div className="btn flex justify-end bg-primary">
          <Button onClick={toggleAddBill}>
            {showAddBill ? 'Cancel' : 'Add Bill'}
          </Button>
        </div>

        {showAddBill && <AddBill onAddBill={handleAddBill} />}
        <p>No bills found.</p>
      </div>
    )
  console.log(bills)

  function handleAddBill() {
    setShowAddBill(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      <div className="flex justify-end bg-primary">
        <Button onClick={toggleAddBill} className="btn">
          {showAddBill ? 'Cancel' : 'Add Bill'}
        </Button>
      </div>

      {showAddBill && <AddBill onAddBill={handleAddBill} />}

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {bills.length === 0 ? (
          <p>No bills found.</p>
        ) : (
          bills.map((bill) => (
            <BillCard
              key={bill.id}
              title={bill.title}
              dueDate={new Date(bill.dueDate)}
              totalAmount={bill.totalAmount}
            />
          ))
        )}
      </div>
    </div>
  )
}
