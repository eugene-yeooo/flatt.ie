import BillCard from './BillsCard'
import { useGetAllBills } from '../../hooks/useBills'
import AddBill from './AddBill'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { UpdateBillData } from 'models/models'
import UpdateBill from './UpdateBill'
import BillSearch from './BillSearch'
import { Plus } from 'lucide-react'

export default function Bills() {
  const { data: bills, isPending, error } = useGetAllBills()
  const [showAddBill, setShowAddBill] = useState(false)
  const [showUpdateBill, setShowUpdateBill] = useState(false)
  const [selectedBill, setSelectedBill] = useState<UpdateBillData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Remove duplicate bills by ID
  const uniqueBills = bills?.filter(
    (bill, index, self) => self.findIndex((b) => b.id === bill.id) === index,
  )

  // Logic for search query
  const filteredBills = uniqueBills?.filter((bill) =>
    bill.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  console.log('Filtered bills:', filteredBills)

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

  // console.log('bills', bills)

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex justify-between">
        <p className="mt-4 text-sm text-gray-600">
          Showing {filteredBills?.length} bill
          {filteredBills?.length !== 1 && 's'}
        </p>
        <div className="flex h-10 justify-end gap-3 bg-primary">
          <BillSearch onSearch={setSearchQuery} />
          <Button
            onClick={toggleAddBill}
            className="flex min-w-fit items-center gap-1 border border-gray-300 bg-white px-3 py-2 hover:bg-orange-400"
          >
            <Plus size={16} />
            Add Bill
          </Button>
        </div>
      </div>

      {showAddBill && <AddBill onAddBill={handleAddBill} />}

      {showUpdateBill && selectedBill && (
        <UpdateBill setShowUpdateBill={setShowUpdateBill} bill={selectedBill} />
      )}

      <div
        className="mt-4 grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {filteredBills?.length === 0 ? (
          <p>No bills found.</p>
        ) : (
          filteredBills?.map((bill) => (
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
