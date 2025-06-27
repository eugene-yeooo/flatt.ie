import BillCard from './BillsCard'
import { useGetAllBills } from '../../hooks/useBills'
import AddBill from './AddBill'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { UpdateBillData } from 'models/models'
import UpdateBill from './UpdateBill'

export default function Bills() {
  const { data: bills, isPending, error } = useGetAllBills()
  const [showAddBill, setShowAddBill] = useState(false)
  const [showUpdateBill, setShowUpdateBill] = useState(false)
  const [selectedBill, setSelectedBill] = useState<UpdateBillData | null>(null)

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

  function handleAddBill() {
    setShowAddBill(false)
  }

  console.log('bills', bills)

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex justify-end bg-primary">
        <Button onClick={toggleAddBill} className="btn">
          Add Bill
        </Button>
      </div>

      {showAddBill && <AddBill onAddBill={handleAddBill} />}

      {showUpdateBill && selectedBill && (
        <UpdateBill setShowUpdateBill={setShowUpdateBill} bill={selectedBill} />
      )}

      <div
        className="mt-4 grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {bills.length === 0 ? (
          <p>No bills found.</p>
        ) : (
          bills.map((bill) => (
            <BillCard
              key={`${bill.id}-${bill.flattieId ?? 'all'}`}
              id={bill.id}
              title={bill.title}
              dueDate={new Date(bill.dueDate)}
              totalAmount={bill.totalAmount}
              expenseCategory={bill.expenseCategory}
              setShowUpdateBill={setShowUpdateBill}
              setSelectedBill={setSelectedBill}
            />
          ))
        )}
      </div>
    </div>
  )
}
