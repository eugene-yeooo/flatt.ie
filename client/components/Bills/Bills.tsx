import BillCard from './BillsCard'
import { useGetAllBills } from '../../hooks/useBills'
import AddBill from './AddBill'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import UpdateBill from './UpdateBill'
import BillSearch from './BillSearch'
import { Plus, X } from 'lucide-react'

export default function Bills() {
  const { data: bills, isPending, error } = useGetAllBills()
  const [showAddBill, setShowAddBill] = useState(false)
  const [showUpdateBill, setShowUpdateBill] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('')
  const categories = Array.from(
    new Set(bills?.map((b) => b.expenseCategory).filter(Boolean)),
  )

  // Map paid status
  const billStatusMap = new Map<
    number,
    { isUnpaid: boolean; unpaidFlatties: string[] }
  >()

  bills?.forEach((bill) => {
    const current = billStatusMap.get(bill.id) ?? {
      isUnpaid: false,
      unpaidFlatties: [],
    }

    if (bill.paid === 0) {
      current.isUnpaid = true
      if (bill.flattieId) {
        current.unpaidFlatties.push(bill.flattieName)
      }
    }

    billStatusMap.set(bill.id, current)
  })

  // Remove duplicate bills by ID, and then sort by due date (showing most recent bills first)
  const uniqueBills = bills
    ?.filter(
      (bill, index, self) => self.findIndex((b) => b.id === bill.id) === index,
    )
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    )

  // Logic for search query and filtering
  const filteredBills = uniqueBills?.filter((bill) => {
    const query = searchQuery.toLowerCase()
    const now = new Date()
    const due = new Date(bill.dueDate)

    const status = billStatusMap.get(bill.id)
    const isUnpaid = status?.isUnpaid ?? false
    const isOverdue = due < now && isUnpaid
    const isUpcoming = due >= now && isUnpaid

    const matchesSearch =
      bill.title.toLowerCase().includes(query) ||
      bill.expenseCategory?.toLowerCase().includes(query) ||
      bill.totalAmount.toString().includes(query) ||
      bill.dueDate.toString().includes(query)

    const matchesFilter =
      filter === '' ||
      bill.expenseCategory === filter ||
      (filter === 'overdue' && isOverdue) ||
      (filter === 'upcoming' && isUpcoming)

    return matchesSearch && matchesFilter
  })

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
      <div className="flex justify-between pb-1">
        <p className="text-md ml-2 mt-4 border-b">
          Showing <span className="font-semibold">{filteredBills?.length}</span>{' '}
          bill
          {filteredBills?.length !== 1 && 's'}
        </p>
        <div className="flex h-10 justify-end gap-3 bg-primary">
          {filter !== '' && (
            <button
              onClick={() => setFilter('')}
              className="flex flex-shrink-0 translate-y-0.5 items-center text-sm italic text-gray-400"
            >
              <X size={16} className="translate-y-0 pr-1" /> clear filter
            </button>
          )}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-md text-md focus:ring-primary/50 mt-1 block rounded border border-gray-300 px-3 py-0 leading-normal focus:border-primary focus:ring"
          >
            <option value="">All</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
        <UpdateBill
          billId={selectedBill}
          onClose={() => setShowUpdateBill(false)}
        />
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
              paid={!billStatusMap.get(bill.id)?.isUnpaid}
              unpaidFlatties={billStatusMap.get(bill.id)?.unpaidFlatties || []}
              setSelectedBill={setSelectedBill}
            />
          ))
        )}
      </div>
    </div>
  )
}
